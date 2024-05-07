import imageSrc from "./logo.png";
import jsPDF from "jspdf";
import "jspdf-autotable";

export const exportToPDF = (columns, data, options = {}) => {
  const doc = new jsPDF();
  const { title } = options;
  const logo = new Image();
  logo.src = imageSrc;
  logo.onload = () => {
    const logoWidth = 40;
    const pageWidth = doc.internal.pageSize.getWidth();
    const xPosition = (pageWidth - logoWidth) / 2;
    doc.addImage(logo, "PNG", xPosition, 5, logoWidth, 40);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    const textWidth =
      (doc.getStringUnitWidth(title) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    const textXPosition = (pageWidth - textWidth) / 2;
    doc.setTextColor(0, 0, 0);
    doc.text(title, textXPosition, 45);
    generateTable(doc, columns, data);
    savePDF(doc);
  };
};

const generateTable = (doc, columns, data) => {
  console.log(columns)
  console.log(data)

  const rows = data.map((row) => columns.map((col) => row[col.field]));
  console.log(rows)

  doc.autoTable({
    head: [columns.map((col) => col.headerName)],
    body: rows,
    startY: 55,
  });
};

const savePDF = (doc) => {
  const today = new Date();
  const formattedDate = today.toISOString().slice(0, 10);
  const filename = `document-${formattedDate}.pdf`;
  doc.save(filename);
};
