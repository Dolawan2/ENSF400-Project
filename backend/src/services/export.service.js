function formatTxt(generation) {
  let output = `SUMMARY\n${'='.repeat(40)}\n${generation.summary}\n\n`;
  output += `QUESTIONS (${generation.question_type})\n${'='.repeat(40)}\n`;

  const questions = generation.questions;
  questions.forEach((q, i) => {
    output += `\n${i + 1}. ${q.question}\n`;
    if (q.options) {
      q.options.forEach((opt, j) => {
        const label = String.fromCharCode(65 + j);
        output += `   ${label}) ${opt}\n`;
      });
      output += `   Answer: ${q.answer}\n`;
    } else if (q.sampleAnswer) {
      output += `   Sample Answer: ${q.sampleAnswer}\n`;
    }
  });

  return output;
}

function formatCsv(generation) {
  const questions = generation.questions;

  if (generation.question_type === 'multiple_choice') {
    let csv = 'question,optionA,optionB,optionC,optionD,answer\n';
    questions.forEach((q) => {
      const escaped = [q.question, ...q.options, q.answer].map(
        (f) => `"${String(f).replace(/"/g, '""')}"`
      );
      csv += escaped.join(',') + '\n';
    });
    return csv;
  }

  let csv = 'question,sampleAnswer\n';
  questions.forEach((q) => {
    const escaped = [q.question, q.sampleAnswer].map(
      (f) => `"${String(f).replace(/"/g, '""')}"`
    );
    csv += escaped.join(',') + '\n';
  });
  return csv;
}

function formatMd(generation) {
  let md = `## Summary\n\n${generation.summary}\n\n`;
  md += `## Questions (${generation.question_type.replace('_', ' ')})\n\n`;

  const questions = generation.questions;
  questions.forEach((q, i) => {
    md += `**${i + 1}. ${q.question}**\n\n`;
    if (q.options) {
      q.options.forEach((opt, j) => {
        const label = String.fromCharCode(65 + j);
        md += `- ${label}) ${opt}\n`;
      });
      md += `\n*Answer: ${q.answer}*\n\n`;
    } else if (q.sampleAnswer) {
      md += `*Sample Answer: ${q.sampleAnswer}*\n\n`;
    }
  });

  return md;
}

module.exports = { formatTxt, formatCsv, formatMd };
