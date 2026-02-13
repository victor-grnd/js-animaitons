export default {
  async fetch(request, env) {
    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    try {
      const { prompt, caseStudies } = await request.json();

      if (!prompt || !caseStudies || !Array.isArray(caseStudies)) {
        return new Response(JSON.stringify({ error: "Invalid request body" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Build the case studies context
      const caseStudiesContext = caseStudies
        .map((cs, index) => {
          return `
--- CASE STUDY ${index + 1}: ${cs.title} ---
${cs.content}
--- END CASE STUDY ${index + 1} ---
`;
        })
        .join("\n");

      // Create the AI prompt
      const systemPrompt = `You are a helpful assistant for a creative agency called Climb. Your job is to analyze potential client needs and match them with the most relevant case study from the agency's portfolio.

You must respond with valid JSON only. No markdown, no code blocks, just pure JSON.

The JSON must have this exact structure:
{
  "matchedCaseStudy": "exact title of the best matching case study",
  "matchedLink": "the link from that case study",
  "explanation": "HTML formatted explanation"
}

For the "explanation" field, write compelling HTML content that:
1. Addresses the user directly in second person (you, your)
2. Explains why this case study is the perfect match for their needs
3. Highlights specific results and outcomes from the case study that align with what they're looking for
4. Uses proper HTML with <h3> for headings and <p> for paragraphs
5. Is persuasive and shows how the agency can deliver similar results for them
6. Keep it concise but impactful - around 3-4 paragraphs`;

      const userMessage = `Here are the available case studies:

${caseStudiesContext}

A potential client has the following needs:
"${prompt}"

Analyze their needs and find the case study that best matches what they're looking for. Consider factors like:
- Type of work needed (website, branding, film)
- Timeline requirements
- Desired outcomes and results
- Industry or product type similarities

Return your response as valid JSON only.`;

      // Call Cloudflare AI using native binding
      const aiResponse = await env.AI.run("@cf/meta/llama-3.1-70b-instruct", {
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
        max_tokens: 1024,
        temperature: 0.7,
      });

      // Parse the AI response
      let result;
      try {
        // Clean the response in case there's any markdown formatting
        let responseText = aiResponse.response;
        responseText = responseText
          .replace(/```json\n?/g, "")
          .replace(/```\n?/g, "")
          .trim();
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Failed to parse AI response:", aiResponse.response);
        // Fallback response
        result = {
          matchedCaseStudy: caseStudies[0]?.title || "Velt",
          matchedLink: caseStudies[0]?.link || "/projects/velt",
          explanation: `<h3>We'd Love to Help</h3><p>Based on your inquiry, we believe our team can deliver exceptional results for your project. Our portfolio demonstrates our ability to create impactful work across branding, web design, and film production.</p><p>Please view our featured case study to learn more about our approach and results.</p>`,
        };
      }

      // Validate the matched case study exists
      const matchedStudy = caseStudies.find(
        (cs) =>
          cs.title.toLowerCase() === result.matchedCaseStudy?.toLowerCase(),
      );

      if (matchedStudy) {
        result.matchedLink = matchedStudy.link;
      }

      return new Response(JSON.stringify(result), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    } catch (error) {
      console.error("Worker error:", error);
      return new Response(JSON.stringify({ error: "Internal server error" }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }
  },
};
