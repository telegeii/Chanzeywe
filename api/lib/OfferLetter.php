<?php
require_once __DIR__ . '/../vendor/fpdf/fpdf.php';

/**
 * Generates the Chanzeywe-branded acceptance offer letter PDF. Structure
 * follows the standard TVET "letter of offer" format (letterhead,
 * reference, course details, required documents, notes, signature) —
 * every figure in it is pulled from real site data (courses table,
 * principal table, the same admission-documents list already published
 * on every department page), nothing invented.
 */
class OfferLetter {
    const BLUE      = [10, 61, 143];
    const DARK_TEXT = [26, 31, 54];
    const MUTED     = [90, 98, 117];

    // Kept identical to the `admissionDocs` list published on every
    // department page (Computing.jsx etc.) so the letter never contradicts
    // the website.
    const REQUIRED_DOCS = [
        'Registration fee: Kshs. 500 (non-refundable)',
        'Duly filled Admission & Medical Form',
        'Copy of ID / Birth Certificate',
        'Academic certificates / result slips',
        'Two passport size photographs',
    ];

    public static function generate(array $application, array $course, array $principal): string {
        $logoPath = __DIR__ . '/../../src/assets/Logo.png';

        $pdf = new FPDF('P', 'mm', 'A4');
        $pdf->SetMargins(20, 18, 20);
        $pdf->SetAutoPageBreak(true, 14);
        $pdf->AddPage();
        $pdf->SetTextColor(...self::DARK_TEXT);

        // ── Letterhead ──
        if (is_file($logoPath)) {
            $pdf->Image($logoPath, 20, 14, 20, 20);
        }
        $pdf->SetXY(45, 15);
        $pdf->SetFont('Arial', 'B', 15);
        $pdf->SetTextColor(...self::BLUE);
        $pdf->Cell(0, 7, 'CHANZEYWE VOCATIONAL TRAINING COLLEGE', 0, 1);
        $pdf->SetX(45);
        $pdf->SetFont('Arial', '', 9);
        $pdf->SetTextColor(...self::MUTED);
        $pdf->Cell(0, 5, 'P.O. Box 413 - 50310, Vihiga County, Kenya', 0, 1);
        $pdf->SetX(45);
        $pdf->Cell(0, 5, 'Tel: +254 740 932 743  |  Email: chanzeywetvc@gmail.com', 0, 1);

        $pdf->SetTextColor(...self::DARK_TEXT);
        $pdf->SetY(38);
        $pdf->SetDrawColor(...self::BLUE);
        $pdf->SetLineWidth(0.6);
        $pdf->Line(20, 38, 190, 38);
        $pdf->Ln(10);

        // ── Title ──
        $pdf->SetFont('Arial', 'B', 14);
        $pdf->Cell(0, 8, 'LETTER OF OFFER', 0, 1, 'C');
        $pdf->Ln(4);

        // ── Recipient + reference ──
        $pdf->SetFont('Arial', '', 11);
        $pdf->Cell(0, 6, 'To: ' . $application['full_name'], 0, 1);
        $pdf->Ln(2);

        $pdf->SetFont('Arial', 'B', 10);
        $pdf->Cell(95, 6, 'Our Reference: ' . $application['reference_number']);
        $pdf->Cell(0, 6, 'Date: ' . date('d F Y'), 0, 1, 'R');
        $pdf->Ln(4);

        $firstName = trim(explode(' ', trim($application['full_name']))[0]);
        $pdf->SetFont('Arial', '', 11);
        $pdf->Cell(0, 6, 'Dear ' . $firstName . ',', 0, 1);
        $pdf->Ln(2);

        $pdf->SetFont('Arial', 'BU', 11);
        $pdf->MultiCell(0, 6, 'RE: APPLICATION FOR ' . strtoupper($course['title']) . ' - ' . strtoupper($course['level']));
        $pdf->Ln(2);

        // ── Body ──
        $pdf->SetFont('Arial', '', 11);
        $pdf->MultiCell(0, 6,
            'I am pleased to inform you that your application to Chanzeywe Vocational Training College ' .
            'has been successful. You have been offered a place in the above programme, subject to the ' .
            'terms below and confirmation of your academic documents at registration.'
        );
        $pdf->Ln(4);

        // ── Course details table ──
        $rows = [
            ['Course', $course['title']],
            ['Level', $course['level']],
            ['Duration', $course['duration'] ?: '-'],
            ['Examining Body', $course['exam_body'] ?: '-'],
        ];
        $pdf->SetFont('Arial', 'B', 10.5);
        foreach ($rows as [$label, $value]) {
            $pdf->SetFillColor(245, 247, 251);
            $pdf->Cell(45, 8, $label, 0, 0, 'L', true);
            $pdf->SetFont('Arial', '', 10.5);
            $pdf->Cell(0, 8, (string)$value, 0, 1, 'L', true);
            $pdf->SetFont('Arial', 'B', 10.5);
        }
        $pdf->Ln(4);

        // ── Required documents ──
        $pdf->SetFont('Arial', 'B', 11);
        $pdf->Cell(0, 7, 'Please bring the following on registration day:', 0, 1);
        $pdf->SetFont('Arial', '', 10.5);
        foreach (self::REQUIRED_DOCS as $doc) {
            $pdf->Cell(6, 6, chr(149)); // bullet
            $pdf->MultiCell(0, 6, $doc);
        }
        $pdf->Ln(2);

        // ── Notes ──
        $pdf->SetFont('Arial', 'B', 11);
        $pdf->Cell(0, 7, 'Important notes:', 0, 1);
        $pdf->SetFont('Arial', '', 10.5);
        $notes = [
            'This offer is valid for the intake stated on the college website and lapses if registration is not completed by the published deadline.',
            'Fees are payable at registration; no cash payments are accepted on campus.',
            'Sponsorship, bursaries or financial assistance from third parties are not guaranteed by the college.',
            'Please quote your reference number (' . $application['reference_number'] . ') in any correspondence with the college.',
        ];
        foreach ($notes as $note) {
            $pdf->Cell(6, 6, chr(149));
            $pdf->MultiCell(0, 6, $note);
        }
        $pdf->Ln(4);

        $pdf->MultiCell(0, 6, 'On behalf of the college, congratulations on this achievement - we look forward to welcoming you.');
        $pdf->Ln(6);

        // ── Signature ──
        $pdf->Cell(0, 6, 'Yours faithfully,', 0, 1);
        $pdf->Ln(10);
        $pdf->SetFont('Arial', 'B', 11);
        $pdf->Cell(0, 6, $principal['name'] ?: 'The Principal', 0, 1);
        $pdf->SetFont('Arial', '', 10.5);
        $pdf->Cell(0, 6, $principal['title'] ?: 'Principal', 0, 1);

        return $pdf->Output('S');
    }
}
