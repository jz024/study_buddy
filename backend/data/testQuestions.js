const testQuestions = [
  {
    id: 1,
    question: "What is the capital of France and what is it famous for?",
    subject: "general",
    difficulty: "easy",
    expectedKeywords: ["Paris", "Eiffel Tower", "Louvre", "culture"]
  },
  {
    id: 2,
    question: "What is 15% of 200 and how do you calculate percentages?",
    subject: "mathematics",
    difficulty: "easy",
    expectedKeywords: ["30", "multiply", "divide", "decimal"]
  },
  {
    id: 3,
    question: "Explain the difference between 'affect' and 'effect' with examples.",
    subject: "english",
    difficulty: "medium",
    expectedKeywords: ["verb", "noun", "influence", "result"]
  },
  {
    id: 4,
    question: "How does photosynthesis work and why is it important for life on Earth?",
    subject: "science",
    difficulty: "medium",
    expectedKeywords: ["sunlight", "carbon dioxide", "oxygen", "glucose"]
  },
  {
    id: 5,
    question: "What were the main causes of World War I and how did they lead to the conflict?",
    subject: "history",
    difficulty: "medium",
    expectedKeywords: ["nationalism", "imperialism", "alliances", "assassination"]
  },
  {
    id: 6,
    question: "Explain how a binary search algorithm works and what makes it efficient.",
    subject: "computer-science",
    difficulty: "medium-hard",
    expectedKeywords: ["sorted array", "divide and conquer", "O(log n)", "middle element"]
  },
  {
    id: 7,
    question: "Analyze the theme of power in Shakespeare's Macbeth, focusing on how ambition corrupts.",
    subject: "english",
    difficulty: "hard",
    expectedKeywords: ["ambition", "corruption", "guilt", "supernatural", "tragedy"]
  },
  {
    id: 8,
    question: "Explain the concept of derivatives in calculus and their real-world applications.",
    subject: "mathematics",
    difficulty: "hard",
    expectedKeywords: ["slope", "tangent line", "instantaneous rate", "velocity"]
  },
  {
    id: 9,
    question: "Discuss the trolley problem and how it relates to utilitarian vs deontological ethics.",
    subject: "philosophy",
    difficulty: "hard",
    expectedKeywords: ["moral dilemma", "greatest good", "duty", "consequences"]
  },
  {
    id: 10,
    question: "How do climate change, economic systems, and human behavior interact to create environmental challenges?",
    subject: "general",
    difficulty: "very-hard",
    expectedKeywords: ["greenhouse gases", "capitalism", "consumer behavior", "sustainability"]
  }
];

module.exports = { testQuestions }; 