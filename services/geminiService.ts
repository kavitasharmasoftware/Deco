import { GoogleGenAI, Type, Schema } from "@google/genai";
import { GeneratedWebsite, WebsiteTheme } from "../types";

const apiKey = process.env.API_KEY;

if (!apiKey) {
  console.error("API Key is missing. Please set process.env.API_KEY.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || '' });

const websiteSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    theme: {
      type: Type.STRING,
      enum: [WebsiteTheme.MODERN, WebsiteTheme.ELEGANT, WebsiteTheme.BOLD, WebsiteTheme.MINIMAL, WebsiteTheme.CYBER],
    },
    fontPairing: {
      type: Type.OBJECT,
      properties: {
        heading: { type: Type.STRING, description: "Font family for headings (e.g., 'Playfair Display', 'Inter', 'Space Grotesk')" },
        body: { type: Type.STRING, description: "Font family for body text" },
      },
      required: ["heading", "body"]
    },
    colorPalette: {
      type: Type.OBJECT,
      properties: {
        primary: { type: Type.STRING },
        secondary: { type: Type.STRING },
        background: { type: Type.STRING },
        text: { type: Type.STRING },
        accent: { type: Type.STRING },
      },
      required: ["primary", "secondary", "background", "text", "accent"],
    },
    header: {
      type: Type.OBJECT,
      properties: {
        companyName: { type: Type.STRING },
        navLinks: { type: Type.ARRAY, items: { type: Type.STRING } },
        ctaText: { type: Type.STRING },
      },
      required: ["companyName", "navLinks", "ctaText"],
    },
    hero: {
      type: Type.OBJECT,
      properties: {
        headline: { type: Type.STRING },
        subheadline: { type: Type.STRING },
        ctaPrimary: { type: Type.STRING },
        ctaSecondary: { type: Type.STRING },
        backgroundImageKeyword: { type: Type.STRING },
        videoMood: { type: Type.STRING, description: "A broad category keyword for background video ambience." },
        style3D: { 
          type: Type.STRING, 
          enum: ['orb', 'particles', 'grid', 'waves'],
          description: "The type of immersive 3D background effect to render."
        },
      },
      required: ["headline", "subheadline", "ctaPrimary", "ctaSecondary", "backgroundImageKeyword", "videoMood", "style3D"],
    },
    features: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        subtitle: { type: Type.STRING },
        layout: { type: Type.STRING, enum: ['grid', 'alternating'] },
        items: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              icon: { type: Type.STRING },
              imageKeyword: { type: Type.STRING, description: "Keyword for a relevant feature image" },
            },
            required: ["title", "description", "icon", "imageKeyword"],
          },
        },
      },
      required: ["title", "subtitle", "items", "layout"],
    },
    gallery: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        description: { type: Type.STRING },
        images: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              alt: { type: Type.STRING },
              keyword: { type: Type.STRING },
            },
            required: ["alt", "keyword"]
          }
        }
      },
      required: ["title", "description", "images"]
    },
    videoSection: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        description: { type: Type.STRING },
        videoType: { type: Type.STRING, enum: ['youtube', 'ambient'] },
        videoKeyword: { type: Type.STRING, description: "Keyword for video." },
      },
      required: ["title", "description", "videoType", "videoKeyword"]
    },
    testimonials: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        items: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              quote: { type: Type.STRING },
              author: { type: Type.STRING },
              role: { type: Type.STRING },
            },
            required: ["quote", "author", "role"],
          },
        },
      },
      required: ["title", "items"],
    },
    footer: {
      type: Type.OBJECT,
      properties: {
        copyright: { type: Type.STRING },
        socialLinks: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ["copyright", "socialLinks"],
    },
  },
  required: ["theme", "fontPairing", "colorPalette", "header", "hero", "features", "gallery", "videoSection", "testimonials", "footer"],
};

export const generateWebsiteContent = async (
  businessName: string,
  description: string
): Promise<GeneratedWebsite> => {
  try {
    const prompt = `
      You are an expert web designer for DECo.
      Create a high-end, visually stunning website configuration for a business named "${businessName}".
      
      Business Description: ${description}
      
      Requirements:
      1. Choose a "theme" that perfectly fits the business.
      2. Select a "colorPalette" that is modern, accessible, and high-contrast.
      3. For "hero", choose a 'style3D' (orb, particles, grid, waves) that best matches the vibe. 'orb' is good for creative, 'grid' for tech, 'particles' for magic, 'waves' for calming.
      4. For "videoMood", pick a broad category: 'business', 'nature', 'tech', 'coffee', 'city', 'space', 'fashion', 'gym'.
      5. Create engaging copy and select Lucide icon names.
      6. Include a gallery and video section.
      7. Ensure copy is marketing-ready and persuasive.

      Output must be strictly JSON matching the schema.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: websiteSchema,
        temperature: 0.75, 
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return JSON.parse(text) as GeneratedWebsite;
  } catch (error) {
    console.error("Error generating website:", error);
    throw error;
  }
};

export const generateImage = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: `High quality, photorealistic, 4k, commercial photography, ${prompt}`,
          },
        ],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    
    throw new Error("No image data received");
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};