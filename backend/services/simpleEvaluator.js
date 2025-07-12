class SimpleEvaluator {
  // Calculate response length (word count)
  calculateLength(response) {
    return response.split(/\s+/).length;
  }

  // Check if response contains expected keywords
  calculateRelevance(response, expectedKeywords) {
    const responseLower = response.toLowerCase();
    const foundKeywords = expectedKeywords.filter(keyword => 
      responseLower.includes(keyword.toLowerCase())
    );
    return foundKeywords.length / expectedKeywords.length;
  }

  // Simple consistency check for A/A testing
  calculateConsistency(response1, response2) {
    const words1 = new Set(response1.toLowerCase().split(/\s+/));
    const words2 = new Set(response2.toLowerCase().split(/\s+/));
    
    const intersection = new Set([...words1].filter(x => words2.has(x)));
    const union = new Set([...words1, ...words2]);
    
    return intersection.size / union.size; // Jaccard similarity
  }

  // Calculate basic metrics for a response
  evaluateResponse(response, expectedKeywords = []) {
    return {
      length: this.calculateLength(response),
      relevance: expectedKeywords.length > 0 ? this.calculateRelevance(response, expectedKeywords) : 0,
      hasKeywords: expectedKeywords.length > 0 ? this.calculateRelevance(response, expectedKeywords) > 0.5 : null
    };
  }

  // Compare two responses for A/A testing
  compareResponses(response1, response2, expectedKeywords = []) {
    const eval1 = this.evaluateResponse(response1, expectedKeywords);
    const eval2 = this.evaluateResponse(response2, expectedKeywords);
    
    return {
      consistency: this.calculateConsistency(response1, response2),
      lengthDifference: Math.abs(eval1.length - eval2.length),
      relevanceDifference: Math.abs(eval1.relevance - eval2.relevance),
      isConsistent: this.calculateConsistency(response1, response2) > 0.3 // Threshold for consistency
    };
  }
}

module.exports = new SimpleEvaluator(); 