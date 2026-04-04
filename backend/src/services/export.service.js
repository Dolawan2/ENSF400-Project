function formatStructuredSummaryTxt(structured) {
  let output = '';
  if (structured.title) {
    output += `${structured.title}\n${'='.repeat(40)}\n\n`;
  }
  for (const section of structured.sections || []) {
    output += `${section.title}\n${'-'.repeat(30)}\n`;
    for (const p of section.paragraphs || []) {
      output += `${p}\n\n`;
    }
    for (const b of section.bullets || []) {
      output += `  - ${b}\n`;
    }
    output += '\n';
  }
  return output;
}

function formatTxt(generation) {
  let output = `SUMMARY\n${'='.repeat(40)}\n`;

  if (generation.structured_summary?.sections) {
    output += formatStructuredSummaryTxt(generation.structured_summary);
  } else {
    output += `${generation.summary}\n\n`;
  }

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

function formatStructuredSummaryMd(structured) {
  let md = '';
  if (structured.title) {
    md += `# ${structured.title}\n\n`;
  }
  for (const section of structured.sections || []) {
    md += `### ${section.title}\n\n`;
    for (const p of section.paragraphs || []) {
      md += `${p}\n\n`;
    }
    if (section.bullets?.length > 0) {
      for (const b of section.bullets) {
        md += `- ${b}\n`;
      }
      md += '\n';
    }
  }
  return md;
}

function formatMd(generation) {
  let md = '';

  if (generation.structured_summary?.sections) {
    md += formatStructuredSummaryMd(generation.structured_summary);
  } else {
    md += `## Summary\n\n${generation.summary}\n\n`;
  }

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
