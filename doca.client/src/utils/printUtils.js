export function generatePrintHtml({ title, content, versions, currentVersionId, headerImg, footerImg, author }) {
    const currentVersion = versions?.find(v => v.id === currentVersionId);

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${title}</title>
      <style>
        @page { size: A4; margin: 15mm; }
        body { font-family: 'Times New Roman', serif; line-height: 1.5; margin: 0; padding: 20px; color: #000; }
        .header { text-align: center; margin-bottom: 20px; }
        .header img { max-width: 100%; height: auto; }
        .footer { margin-top: 40px; border-top: 1px solid #888; padding-top: 5px; font-size: 10px; color: #555; text-align: center; }
        .content { min-height: 400px; }
        .content h1 { font-size: 20px; text-align: center; margin: 0 0 15px 0; font-weight: bold; }
        .content h2 { font-size: 18px; margin: 15px 0 10px 0; font-weight: bold; }
        .content h3 { font-size: 16px; margin: 10px 0 8px 0; font-weight: bold; }
        .content p { margin: 0 0 10px 0; }
        .content ul, .content ol { margin: 0 0 10px 20px; padding: 0; }
        .content li { margin: 0 0 5px 0; }
        .content blockquote { border-left: 3px solid #ccc; margin: 10px 0; padding: 5px 15px; color: #555; font-style: italic; }
        .content img { max-width: 100%; height: auto; display: block; margin: 10px auto; border-radius: 4px; }
        .content img.align-left { margin-left: 0; margin-right: auto; }
        .content img.align-right { margin-right: 0; margin-left: auto; }
        .content a { color: #0066cc; text-decoration: none; }
        .content strong { font-weight: bold; }
        .content em { font-style: italic; }
        .content u { text-decoration: underline; }
        .content mark { background: #fef08a; padding: 2px 4px; }
        @media print { .no-print { display: none !important; } body { padding: 0; } }
      </style>
    </head>
    <body>
      <div class="header">${headerImg ? `<img src="${headerImg}" alt="Бланк">` : ''}</div>
      <h1>${title}</h1>
      <div class="content">${content}</div>
      <div class="footer">
        Версия: ${currentVersion?.versionNumber || 1} |
        Дата: ${new Date().toLocaleDateString('ru-RU')} |
        Автор: ${author}
        ${footerImg ? `<br><img src="${footerImg}" style="max-height:30px; margin-top:5px;">` : ''}
      </div>
    </body>
    </html>
  `;
}

export function openPrintWindow(html) {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 300);
}