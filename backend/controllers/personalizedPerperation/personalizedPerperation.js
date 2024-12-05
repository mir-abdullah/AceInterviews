import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

//call model
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: {
    responseMimeType: "application/json",
  },
});

export const preperation = async (req, res) => {
    try {
      const { requirements } = req.body; // Corrected spelling
      if (!requirements) {
        return res.status(400).json({ msg: "Requirements are required" });
      }
  
      const response = await providePreparationMaterial(requirements); // Added await
      const { essentialSkills, resources, commonQuestions, applicationTips } = response;
  
      res.status(200).json({ essentialSkills, resources, commonQuestions, applicationTips });
    } catch (error) {
      console.error("Error in preparation:", error.message);
      res.status(500).json({ msg: "An error occurred while processing the request." });
    }
  };
  

async function providePreparationMaterial(jobRequirements) {
    try {
      const prompt = `
        You are a career guidance expert. Based on the following job application requirements, provide comprehensive preparation material.
        Job Application Requirements: ${jobRequirements}
        
        The preparation material should include:
        1. A list of essential skills needed for this role.
        2. Resources (e.g., online courses, books, articles) to master these skills.
        3. A set of common interview questions related to this role.
        4. Tips for excelling in the application process.
        
        Provide the material in the following JSON format:
        {
          "type": "object",
          "properties": {
            "essentialSkills": { "type": "array", "items": { "type": "string" } },
            "resources": { "type": "array", "items": { "type": "string" } },
            "commonQuestions": { "type": "array", "items": { "type": "string" } },
            "applicationTips": { "type": "array", "items": { "type": "string" } }
          }
        }
      `;
  
      const result = await model.generateContent(prompt);
  
      // Validate and parse the response
      const preparationText = await result.response.text();
      const preparationMaterial = JSON.parse(preparationText);
  
      const { essentialSkills, resources, commonQuestions, applicationTips } = preparationMaterial;
  
      // Return the preparation material
      return {
        essentialSkills,
        resources,
        commonQuestions,
        applicationTips,
      };
    } catch (error) {
      console.error("Error generating preparation material:", error.message);
      return {
        essentialSkills: [],
        resources: [],
        commonQuestions: [],
        applicationTips: ["Unable to generate preparation material at this time."],
      };
    }
  }
  