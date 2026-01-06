// Firebase Core Imports
const functions = require("firebase-functions");
const PDFDocument = require("pdfkit");
const cors = require('cors')({ origin: true }); // Used for the V1 onRequest function

// --- Standard V2 Modular Imports for callable function and secrets ---
// NOTE: These are the standard paths for firebase-functions@4.x.x+
const { onCall } = require('firebase-functions/v2/https'); 
// Remove: const { defineSecret } = require('firebase-functions/v2/secrets'); 
const { GoogleGenAI } = require('@google/genai');

// Use environment variable instead of defineSecret
const GEMINI_KEY = process.env.GEMINI_API_KEY;

// --- KARMAI (V2 CALLABLE FUNCTION) ---

exports.generateKarmAIPlan = onCall({
    region: 'us-central1',  
    cors: true             
}, async (request) => {
    
    if (!GEMINI_KEY) {
        throw new Error("GEMINI_API_KEY is not set in environment variables.");
    }

    const MODEL_NAME = "gemini-2.5-flash"; 

    // --- AUTH CHECK ---
    if (!request.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be logged in to request a plan.');
    }
    
    const ai = new GoogleGenAI({ apiKey: GEMINI_KEY });
    
    const { education, skills, interests, goals } = request.data;

    const systemInstruction = `You are KarmAI, an expert career guidance counselor for university students. Your goal is to generate a personalized, structured, and actionable 3-step action plan for their next 12 months based on their profile. Use markdown formatting.`;

    const userPrompt = `
        Generate the 3-Step Action Plan. Each step must cover a 4-month period.

        **USER PROFILE:**
        - **Education:** ${education}
        - **Current Skills:** ${skills}
        - **Interests/Fields:** ${interests}
        - **Long-Term Goals:** ${goals}

        **THE 3-STEP PLAN FORMAT:**
        ### Step 1: Immediate Focus (Months 1-4)
        * **Action:** ...
        * **Goal:** ...
        * **Why:** ...

        ### Step 2: Mid-Term Momentum (Months 5-8)
        * **Action:** ...
        * **Goal:** ...
        * **Why:** ...

        ### Step 3: Long-Term Vision (Months 9-12)
        * **Action:** ...
        * **Goal:** ...
        * **Why:** ...
    `;

    try {
        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: [{ role: "user", parts: [{ text: userPrompt }] }],
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.7 
            }
        });
        
        const aiPlan = response.text;

        return { plan: aiPlan };

    } catch (error) {
        console.error("Gemini API Error:", error);
        throw new functions.https.HttpsError('internal', 'AI Model failed to generate a response.');
    }
});

// --- RESUME GENERATOR (V1 HTTP REQUEST FUNCTION - Kept as V1 since it's working) ---

exports.generateResumePdf = functions.https.onRequest(async (req, res) => {
    // Handle the CORS preflight request (necessary for V1 onRequest)
    cors(req, res, async () => {
        if (req.method === 'OPTIONS') {
            res.set('Access-Control-Allow-Origin', '*');
            res.set('Access-Control-Allow-Methods', 'POST');
            res.set('Access-Control-Allow-Headers', 'Content-Type');
            res.set('Access-Control-Max-Age', '3600');
            return res.status(204).send('');
        }

        if (req.method !== 'POST') {
            return res.status(405).send('Method Not Allowed');
        }

        try {
            const formData = req.body;
            const doc = new PDFDocument();
            let buffers = [];
            doc.on('data', buffers.push.bind(buffers));

            // Helper function to add a section with a heading
            const addSection = (title) => {
                doc.moveDown(1.5).fontSize(16).fillColor('gray').text(title);
                doc.strokeColor('gray').lineWidth(1).lineCap('butt').moveTo(50, doc.y).lineTo(550, doc.y).stroke();
                doc.moveDown(0.5);
            };

            // Add Resume Content 
            if (formData.name) {
                doc.fontSize(25).fillColor('black').text(formData.name, { align: 'center' });
            }
            if (formData.email || formData.phone || formData.address) {
                doc.fontSize(10).fillColor('gray').text(
                    `${formData.email || ''} | ${formData.phone || ''} | ${formData.address || ''}`,
                    { align: 'center' }
                );
            }

            // Add links
            if (formData.linkedin || formData.github || formData.portfolio) {
                const links = [
                    formData.linkedin ? `LinkedIn: ${formData.linkedin}` : null,
                    formData.github ? `GitHub: ${formData.github}` : null,
                    formData.portfolio ? `Portfolio: ${formData.portfolio}` : null
                ].filter(Boolean).join(' | ');
                doc.moveDown(0.5).text(links, { align: 'center' });
            }

            // Add Summary
            if (formData.summary) {
                addSection('Professional Summary');
                doc.fontSize(11).fillColor('black').text(formData.summary, { align: 'justify' });
            }

            // Add Education
            if (formData.education && formData.education.length > 0 && formData.education[0].degree) {
                addSection('Education');
                formData.education.forEach(edu => {
                    doc.fontSize(11).fillColor('black').text(`${edu.degree || ''} at ${edu.university || ''}`);
                    doc.text(`${edu.year || ''}`);
                    if (edu.cgpa) {
                        doc.text(`CGPA: ${edu.cgpa}`);
                    }
                    doc.moveDown(0.5);
                });
            }

            // Add Experience
            if (formData.experience && formData.experience.length > 0 && formData.experience[0].title) {
                addSection('Work Experience');
                formData.experience.forEach(exp => {
                    doc.fontSize(11).fillColor('black').text(`${exp.title || ''} at ${exp.company || ''}`);
                    doc.text(`${exp.startYear || ''} - ${exp.endYear || ''}`);
                    if (exp.description) {
                        doc.text(exp.description.replace(/\n/g, '\n- '));
                    }
                    doc.moveDown(0.5);
                });
            }

            // Add Projects
            if (formData.projects && formData.projects.length > 0 && formData.projects[0].name) {
                addSection('Projects');
                formData.projects.forEach(proj => {
                    doc.fontSize(11).fillColor('black').text(`${proj.name || ''}`, { continued: true });
                    if (proj.link) {
                        doc.text(` [Link](${proj.link})`);
                    }
                    if (proj.description) {
                        doc.moveDown(0.2).text(proj.description.replace(/\n/g, '\n- '));
                    }
                    doc.moveDown(0.5);
                });
            }

            // Add Skills
            if (formData.skills) {
                addSection('Skills');
                doc.fontSize(11).fillColor('black').text(formData.skills);
            }

            // Add Achievements
            if (formData.achievements && formData.achievements.length > 0 && formData.achievements[0].description) {
                addSection('Achievements & Certifications');
                formData.achievements.forEach(ach => {
                    doc.fontSize(11).fillColor('black').text(`${ach.description || ''}`, { continued: true });
                    if (ach.link) {
                        doc.text(` [Link](${ach.link})`);
                    }
                    doc.moveDown(0.5);
                });
            }

            // Add Watermark
            doc.opacity(0.1);
            doc.fontSize(70).text("CampusConnect", 100, 300, {
                align: 'center',
                rotate: -45
            });
            doc.opacity(1);

            doc.end();

            const pdfBuffer = await new Promise((resolve) => doc.on('end', () => resolve(Buffer.concat(buffers))));

            res.setHeader('Content-Type', 'application/pdf');
            res.status(200).send(pdfBuffer);

        } catch (error) {
            console.error("Function crashed with error:", error);
            res.status(500).send("Function crashed due to an internal error.");
        }
    });
});

