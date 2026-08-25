import PDFDocument from "pdfkit";

const audiences = [
  "State and federal agencies",
  "Corrections and rehabilitation",
  "Workforce development boards",
  "Violence prevention initiatives",
  "Public-sector technology programs",
  "Employer and community partners",
];

const pillars = [
  {
    number: "01",
    title: "Reentry education",
    description:
      "Life-readiness coaching and practical preparation that help returning citizens build confidence, direction, and a credible next step.",
  },
  {
    number: "02",
    title: "Reintegration support",
    description:
      "Mentorship, wraparound community support, and direct stakeholder engagement that make the first days and months after release more navigable.",
  },
  {
    number: "03",
    title: "AI and workforce readiness",
    description:
      "Coding, AI literacy, digital entrepreneurship, and employment-focused training aligned to high-growth opportunity.",
  },
];

const capabilities = [
  {
    label: "01 / Message",
    title: "Strategic messaging",
    description:
      "Positioning, narrative systems, and communications built for agency partners, RFP reuse, and clear public understanding.",
  },
  {
    label: "02 / Make",
    title: "Media production",
    description:
      "Human-centered stories and production support that make complex programs visible, credible, and easier to engage with.",
  },
  {
    label: "03 / Ready",
    title: "Contract readiness",
    description:
      "A disciplined creative standard for federal and state partners: consistent, compliance-aware, and ready for the next review.",
  },
  {
    label: "04 / Build",
    title: "Digital products and outcomes reporting",
    description:
      "Digital products, structured content, and outcomes reporting that turn program activity into usable information for decisions, accountability, and next steps.",
  },
];

const engagementPaths = [
  {
    number: "01",
    title: "Program delivery",
    description:
      "Reentry education, life-readiness coaching, mentorship, stabilization, and workforce preparation connected into a route from release to durable opportunity.",
  },
  {
    number: "02",
    title: "Workforce readiness",
    description:
      "Coding, AI literacy, digital entrepreneurship, and practical technology training aligned to high-growth work and the confidence to pursue it.",
  },
  {
    number: "03",
    title: "Communications",
    description:
      "Positioning, narrative architecture, and turnkey media production that help public programs communicate clearly with participants, partners, and the public.",
  },
  {
    number: "04",
    title: "Evidence and tools",
    description:
      "Digital products, structured content, and outcomes reporting that turn program activity into usable information for decisions, accountability, and next steps.",
  },
];

function sectionTitle(doc: PDFKit.PDFDocument, title: string) {
  doc
    .moveDown(0.8)
    .font("Helvetica-Bold")
    .fontSize(10)
    .fillColor("#111111")
    .text(title.toUpperCase(), { characterSpacing: 1.2 });
  doc
    .moveTo(doc.page.margins.left, doc.y + 4)
    .lineTo(doc.page.width - doc.page.margins.right, doc.y + 4)
    .lineWidth(1.5)
    .strokeColor("#111111")
    .stroke();
  doc.moveDown(0.6);
}

export async function buildCapabilitiesPdf(): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "LETTER",
      margins: { top: 54, bottom: 54, left: 54, right: 54 },
      info: {
        Title: "ACS Partner Capabilities Statement",
        Author: "Advanced Creation Studio",
        Subject: "Partner capabilities for agency and community partners",
      },
    });

    const chunks: Buffer[] = [];
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const generatedDate = new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    doc
      .font("Helvetica-Bold")
      .fontSize(18)
      .fillColor("#111111")
      .text("Advanced Creation Studio");
    doc
      .font("Helvetica")
      .fontSize(9)
      .fillColor("#555555")
      .text("advancedcreationstudio.com");
    doc
      .font("Helvetica-Bold")
      .fontSize(9)
      .fillColor("#111111")
      .text("Partner capabilities", { align: "right" });
    doc
      .font("Helvetica")
      .fontSize(9)
      .fillColor("#555555")
      .text(`Generated ${generatedDate}`, { align: "right" });

    doc.moveDown(1.2);
    doc
      .font("Helvetica")
      .fontSize(9)
      .fillColor("#666666")
      .text("FOR AGENCY AND COMMUNITY PARTNERS");
    doc
      .moveDown(0.3)
      .font("Helvetica-Bold")
      .fontSize(22)
      .fillColor("#111111")
      .text("A clear route from mission to movement.", {
        width: 420,
        lineGap: 2,
      });
    doc
      .moveDown(0.4)
      .font("Helvetica")
      .fontSize(11)
      .fillColor("#444444")
      .text(
        "Advanced Creation Studio helps public-sector and community partners turn complex challenges into practical, measurable pathways for people and programs.",
        { width: 460, lineGap: 2 },
      );

    sectionTitle(doc, "Who this is for");
    for (const audience of audiences) {
      doc
        .font("Helvetica")
        .fontSize(10)
        .fillColor("#222222")
        .text(`•  ${audience}`);
    }

    sectionTitle(doc, "Three connected pillars");
    for (const pillar of pillars) {
      doc
        .font("Helvetica-Bold")
        .fontSize(11)
        .fillColor("#111111")
        .text(`${pillar.number}  ${pillar.title}`);
      doc
        .font("Helvetica")
        .fontSize(9)
        .fillColor("#555555")
        .text(pillar.description, { width: 480, lineGap: 1.5 });
      doc.moveDown(0.35);
    }

    sectionTitle(doc, "Built for execution");
    for (const capability of capabilities) {
      doc
        .font("Helvetica")
        .fontSize(8)
        .fillColor("#B8860B")
        .text(capability.label);
      doc
        .font("Helvetica-Bold")
        .fontSize(11)
        .fillColor("#111111")
        .text(capability.title);
      doc
        .font("Helvetica")
        .fontSize(9)
        .fillColor("#555555")
        .text(capability.description, { width: 480, lineGap: 1.5 });
      doc.moveDown(0.35);
    }

    sectionTitle(doc, "Ways to engage");
    for (const path of engagementPaths) {
      doc
        .font("Helvetica-Bold")
        .fontSize(11)
        .fillColor("#111111")
        .text(`${path.number}  ${path.title}`);
      doc
        .font("Helvetica")
        .fontSize(9)
        .fillColor("#555555")
        .text(path.description, { width: 480, lineGap: 1.5 });
      doc.moveDown(0.35);
    }

    doc.moveDown(0.8);
    doc
      .moveTo(doc.page.margins.left, doc.y)
      .lineTo(doc.page.width - doc.page.margins.right, doc.y)
      .lineWidth(1.5)
      .strokeColor("#111111")
      .stroke();
    doc.moveDown(0.6);
    doc
      .font("Helvetica")
      .fontSize(8)
      .fillColor("#B8860B")
      .text("CHOOSE THE NEXT CONVERSATION");
    doc
      .font("Helvetica-Bold")
      .fontSize(14)
      .fillColor("#111111")
      .text("Bring us the mission, constraint, or opportunity.");
    doc
      .font("Helvetica")
      .fontSize(9)
      .fillColor("#555555")
      .text(
        "Request a tailored program briefing at advancedcreationstudio.com/partners",
      );

    doc.end();
  });
}
