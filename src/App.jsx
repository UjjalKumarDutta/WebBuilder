import React, { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import { MdOutlineArrowUpward } from "react-icons/md";
import { ImNewTab } from "react-icons/im";
import { IoMdDownload } from "react-icons/io";
import { BiSolidShow } from "react-icons/bi";
import { FaEyeSlash } from "react-icons/fa";
import Editor from "@monaco-editor/react";
import { RiComputerLine } from "react-icons/ri";
import { FaTabletAlt } from "react-icons/fa";
import { ImMobile2 } from "react-icons/im";
import { IoMdClose } from "react-icons/io";
import { GoogleGenAI } from "@google/genai";
import { API_KEY } from "./helper";
import { toast } from "react-toastify";
import { FadeLoader } from "react-spinners";

const App = () => {
  const [prompt, setPrompt] = useState("");
  const [isShowCode, setIsShowCode] = useState(false);
  const [isInNewTab, setIsInNewTab] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState("desktop");
  const [code, setCode] = useState(
    `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50">
  <div class="max-w-6xl mx-auto px-6 py-6">
    <h1 class="text-[30px] font-[700]">Welcome to WebBuilder</h1>
  </div>
</body>

    `
  );

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  function extractCode(response) {
    const match = response.match(/```(?:\w+)?\n?([\s\S]*?)```/);
    return match ? match[1].trim() : response.trim();
  }

  const downloadCode = () => {
    let filename = "webBuilderCode.html";
    let blob = new Blob([code], { type: "text/plain" });
    let url = URL.createObjectURL(blob);
    let a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
  };

  async function getResponse() {
    if (prompt === "") {
      toast.error("Please eneter a prompt!");
      return;
    }

    setLoading(true);
    const text_prompt = `You are an expert frontend developer and UI/UX designer. The user will provide a detailed prompt describing what kind of website they want. Based on the user’s description, generate a fully working, production-ready website as a **single HTML file**. Use only **HTML, Tailwind CSS (via CDN)**, vanilla JavaScript, and GSAP (via CDN).  

Strict output rules:
- Return the website as a single fenced Markdown code block with the language tag.  
- Do NOT include any explanations, text, or extra code blocks outside that single block. Only the HTML file content.  

Technical requirements:
1. **Stack**: HTML + Tailwind CSS (via CDN) + vanilla JavaScript + GSAP (via CDN). Everything in one file.  
2. **Responsive**: Must be fully responsive (mobile, tablet, desktop) with modern grid and flex layouts.  
3. **Theme**: Default **dark mode**, but if the website type fits better in light mode, auto-select light mode. Include a **toggle button** to switch between dark and light themes.  
4. **Animations & Interactions**:  
   - GSAP scroll-based animations (fade, slide, stagger, parallax).  
   - Smooth hover effects with scale, shadow, and gradient transitions.  
   - Sticky navbar with subtle shadow on scroll.  
   - Animated gradient backgrounds or floating decorative shapes.  
5. **Visual richness**:  
   - Use high-quality **royalty-free images** (Unsplash via direct URLs).  
   - Apply **soft shadows, glassmorphism, or neumorphism** effects where suitable.  
   - Modern cards, rounded corners, gradient buttons, hover animations.  
6. **UI Sections** (as per user request):  
   - Sticky **Navbar** with logo + links + theme toggle.  
   - **Hero section** with headline, subheadline, CTA button, and background image/gradient.  
   - **Main content**: features grid, product showcase, gallery, blog cards, or whatever fits user’s request.  
   - **Call to Action** with strong button.  
   - **Footer** with the text: "Made with WebBuilder"  
7. **Code quality**: Clean, semantic HTML5, ARIA labels for accessibility, well-indented, professional Tailwind usage.  
8. **Performance**: Optimized. No external CSS/JS frameworks beyond Tailwind + GSAP. Use responsive images, gradients, inline SVGs, or Unsplash placeholders.  

Final instruction: Output only the single fenced Markdown code block with the full HTML file content. Nothing else.  

Website prompt: ${prompt}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: text_prompt,
    });
    setCode(extractCode(response.text));
    console.log(response.text);
    setLoading(false);
  }

  return (
    <>
      <Navbar />
      <div className="container">
        {/* HERO SECTION */}
        <div className="heroWrapper">
          <h3 className="text-[30px] font-[700] text-center">
            Create beautiful websites with{" "}
            <span className="bg-gradient-to-br from-violet-400 to-purple-600 bg-clip-text text-transparent">
              WebBuilder
            </span>
          </h3>

          <p className="mt-2 text-[16px] text-[#b3b3b3] text-center">
            Describe your website and ai will code for you.
          </p>

          <div className="inputBox">
            <textarea
              onChange={(e) => setPrompt(e.target.value)}
              value={prompt}
              placeholder="describe your website in detail."
            ></textarea>

            {prompt !== "" && (
              <i
                onClick={getResponse}
                className="sendIcon text-[20px] w-[30px] h-[30px] flex items-center justify-center bg-[#9933ff] rounded-[50%] transition-all duration-300 hover:opacity-[.8]"
              >
                <MdOutlineArrowUpward />
              </i>
            )}
          </div>
        </div>

        {/* TEXT BELOW HERO */}
        <p className="text-[20px] font-[700] mt-[68px] mb-[16px] text-center">
          Your AI-Genreated Website will appear here.
        </p>
      </div>

      <div className="preview ">
        <div className="header w-full h-[70px]">
          <div className="previewHeaderInner">
            <h3 className="font-bold text-[16px]">Live Preview</h3>

            <div className="icons flex items-center gap-[15px]">
              <div
                onClick={() => setIsInNewTab(true)}
                className="icon !w-[auto] !p-[12px] flex items-center gap-[10px]"
              >
                Open in new tab <ImNewTab />
              </div>

              <div
                onClick={downloadCode}
                className="icon !w-[auto] !p-[12px] flex items-center gap-[10px]"
              >
                Download <IoMdDownload />
              </div>

              <div
                onClick={() => setIsShowCode(!isShowCode)}
                className="icon !w-[auto] !p-[12px] flex items-center gap-[10px]"
              >
                {isShowCode ? "Hide Code" : "Show Code"}{" "}
                {isShowCode ? <FaEyeSlash /> : <BiSolidShow />}
              </div>
            </div>
          </div>
        </div>

        <div className="codePreviewWrapper">
          {isShowCode ? (
            <Editor
              onChange={(code) => setCode(code)}
              height="100%"
              theme="vs-dark"
              defaultLanguage="html"
              value={code}
            />
          ) : loading ? (
            <div className="w-full h-full flex items-center justify-center flex-col">
              <FadeLoader color="#9933ff" />
              <h3 className="text-[23px] mt-4 font-semibold">
                <span className="bg-gradient-to-br from-violet-400 to-purple-600 bg-clip-text text-transparent">
                  Generating
                </span>{" "}
                your website...
              </h3>
            </div>
          ) : (
            <iframe
              srcDoc={code}
              title="Live Preview"
              className="previewIframe"
            />
          )}
        </div>
      </div>

      {isInNewTab ? (
        <>
          <div className="modelCon">
            <div className="modelBox text-black">
              <div className="header w-full px-[50px] h-[70px] flex items-center justify-between ">
                <h3 className="font-[700]">Preview</h3>

                <div className="icons flex items-center gap-[15px]">
                  <div
                    className={`icon ${
                      previewMode === "desktop" ? "active" : ""
                    }`}
                    onClick={() => setPreviewMode("desktop")}
                  >
                    <RiComputerLine />
                  </div>

                  <div
                    className={`icon ${
                      previewMode === "tablet" ? "active" : ""
                    }`}
                    onClick={() => setPreviewMode("tablet")}
                  >
                    <FaTabletAlt />
                  </div>

                  <div
                    className={`icon ${
                      previewMode === "mobile" ? "active" : ""
                    }`}
                    onClick={() => setPreviewMode("mobile")}
                  >
                    <ImMobile2 />
                  </div>
                </div>

                <div className="icons">
                  <div
                    className="icon"
                    onClick={() => {
                      setIsInNewTab(false);
                    }}
                  >
                    <IoMdClose />
                  </div>
                </div>
              </div>
              <iframe
                srcDoc={code}
                className="newTabIframe"
                style={{
                  width:
                    previewMode === "desktop"
                      ? "100%"
                      : previewMode === "tablet"
                      ? "768px"
                      : "375px",
                  margin: "0 auto",
                  transition: "width 0.3s ease",
                }}
              ></iframe>
            </div>
          </div>
        </>
      ) : (
        ""
      )}
    </>
  );
};

export default App;
