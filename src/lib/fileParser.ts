// Client-side file parser using dynamic CDN scripts for PDF and DOCX

declare global {
  interface Window {
    pdfjsLib: any;
    mammoth: any;
  }
}

const PDFJS_CDN = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
const PDFJS_WORKER_CDN = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
const MAMMOTH_CDN = "https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js";

// Helper to inject scripts dynamically
function loadScript(src: string, checkGlobal: () => boolean): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    if (checkGlobal()) {
      resolve();
      return;
    }

    // Check if script is already added to document
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      const handleLoad = () => {
        if (checkGlobal()) {
          resolve();
        } else {
          setTimeout(handleLoad, 50);
        }
      };
      handleLoad();
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => {
      // Small timeout to ensure script global execution completes
      setTimeout(() => {
        if (checkGlobal()) {
          resolve();
        } else {
          reject(new Error(`Loaded ${src} but global object was not found.`));
        }
      }, 50);
    };
    script.onerror = () => reject(new Error(`Failed to load script ${src}`));
    document.head.appendChild(script);
  });
}

export async function parseTxtFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text === "string") {
        resolve(text);
      } else {
        reject(new Error("Failed to read text file contents."));
      }
    };
    reader.onerror = () => reject(reader.error || new Error("Error reading text file."));
    reader.readAsText(file);
  });
}

export async function parsePdfFile(file: File): Promise<string> {
  await loadScript(PDFJS_CDN, () => !!window.pdfjsLib);
  
  // Set worker source
  window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_CDN;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const buffer = e.target?.result as ArrayBuffer;
        const loadingTask = window.pdfjsLib.getDocument({ data: new Uint8Array(buffer) });
        const pdf = await loadingTask.promise;
        
        let extractedText = "";
        
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items
            .map((item: any) => item.str)
            .join(" ");
          
          extractedText += pageText + "\n";
        }
        
        if (!extractedText.trim()) {
          reject(new Error("PDF appears to contain no readable text. It might be a scanned image-only PDF."));
        } else {
          resolve(extractedText);
        }
      } catch (err: any) {
        reject(new Error(`PDF Parsing failed: ${err.message || err}`));
      }
    };
    reader.onerror = () => reject(reader.error || new Error("Error reading file into memory."));
    reader.readAsArrayBuffer(file);
  });
}

export async function parseDocxFile(file: File): Promise<string> {
  await loadScript(MAMMOTH_CDN, () => !!window.mammoth);

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const buffer = e.target?.result as ArrayBuffer;
        const result = await window.mammoth.extractRawText({ arrayBuffer: buffer });
        
        if (result.value) {
          resolve(result.value);
        } else {
          reject(new Error("DOCX file extracted text is empty."));
        }
      } catch (err: any) {
        reject(new Error(`DOCX Parsing failed: ${err.message || err}`));
      }
    };
    reader.onerror = () => reject(reader.error || new Error("Error reading file into memory."));
    reader.readAsArrayBuffer(file);
  });
}

export async function parseResumeFile(file: File): Promise<string> {
  const extension = file.name.split(".").pop()?.toLowerCase();
  
  switch (extension) {
    case "txt":
      return parseTxtFile(file);
    case "pdf":
      return parsePdfFile(file);
    case "docx":
      return parseDocxFile(file);
    default:
      throw new Error(`Unsupported file type: .${extension}. Only .pdf, .docx, and .txt files are supported.`);
  }
}
