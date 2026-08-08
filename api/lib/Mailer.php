<?php
require_once __DIR__ . '/../config/env.php';
require_once __DIR__ . '/../vendor/phpmailer/Exception.php';
require_once __DIR__ . '/../vendor/phpmailer/PHPMailer.php';
require_once __DIR__ . '/../vendor/phpmailer/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception as PHPMailerException;

/**
 * Thin SMTP wrapper for acceptance emails. Never throws — a bad/placeholder
 * SMTP config (the default state until real credentials are added to
 * api/config/.env) logs the real reason server-side and returns false, so
 * the caller can update the application status regardless of whether the
 * email actually went out.
 *
 * No PDF attachment — the email just tells the applicant they were
 * accepted and points them at the self-service admission-letter lookup
 * page (?admissionLetterUrl), where they enter their KCSE index number to
 * download the letter themselves. Simpler and more reliable than trying
 * to guarantee attachment delivery.
 */
class Mailer {
    public static function send_offer_email(array $application, string $admissionLetterUrl): bool {
        $host = getenv('SMTP_HOST');
        $user = getenv('SMTP_USERNAME');
        $pass = getenv('SMTP_PASSWORD');

        if (!$host || !$user || !$pass || $pass === 'your-16-char-app-password') {
            error_log('[Mailer] SMTP not configured (placeholder credentials) — skipping send for ' . $application['reference_number']);
            return false;
        }

        $mail = new PHPMailer(true);
        try {
            $mail->isSMTP();
            $mail->Host       = $host;
            $mail->Port       = (int)(getenv('SMTP_PORT') ?: 587);
            $mail->SMTPAuth   = true;
            $mail->Username   = $user;
            $mail->Password   = $pass;
            $mail->SMTPSecure = getenv('SMTP_ENCRYPTION') ?: 'tls';

            $fromEmail = getenv('SMTP_FROM_EMAIL') ?: $user;
            $fromName  = getenv('SMTP_FROM_NAME') ?: 'Chanzeywe Vocational Training College';
            $mail->setFrom($fromEmail, $fromName);
            $mail->addAddress($application['email'], $application['full_name']);

            $firstName = trim(explode(' ', trim($application['full_name']))[0]);
            $mail->Subject = 'Congratulations - You Have Been Admitted to Chanzeywe TVC';
            $mail->isHTML(true);
            $mail->Body = self::body_html($firstName, $application['reference_number'], $application['kcse_index'], $admissionLetterUrl);
            $mail->AltBody = self::body_text($firstName, $application['reference_number'], $application['kcse_index'], $admissionLetterUrl);

            $mail->send();
            return true;
        } catch (PHPMailerException $e) {
            error_log('[Mailer] Failed to send offer email for ' . $application['reference_number'] . ': ' . $mail->ErrorInfo);
            return false;
        }
    }

    private static function body_text(string $firstName, string $reference, string $kcseIndex, string $url): string {
        return "Dear $firstName,\n\n" .
            "Congratulations! Your application to Chanzeywe Vocational Training College has been accepted.\n\n" .
            "Your application reference number is $reference (this will also be printed on your admission letter).\n\n" .
            "To download your official admission letter:\n" .
            "1. Visit $url\n" .
            "2. Enter your KCSE Index Number ($kcseIndex)\n" .
            "3. Download your admission letter as a PDF\n\n" .
            "Please read it carefully for your registration deadline and the documents you need to bring.\n\n" .
            "Congratulations again, and welcome to Chanzeywe TVC.\n\n" .
            "Chanzeywe Vocational Training College\nP.O. Box 413 - 50310, Vihiga County, Kenya\n+254 740 932 743 | chanzeywetvc@gmail.com";
    }

    private static function body_html(string $firstName, string $reference, string $kcseIndex, string $url): string {
        $firstName = htmlspecialchars($firstName);
        $reference = htmlspecialchars($reference);
        $kcseIndex = htmlspecialchars($kcseIndex);
        $urlSafe   = htmlspecialchars($url);
        return <<<HTML
        <div style="font-family:Arial,sans-serif;color:#1a1f36;max-width:560px;margin:0 auto">
          <h2 style="color:#0a3d8f;">Congratulations, $firstName!</h2>
          <p>Your application to <strong>Chanzeywe Vocational Training College</strong> has been accepted.</p>
          <p>Your application reference number is <strong>$reference</strong> (this will also be printed on your admission letter).</p>
          <p style="margin-top:20px;"><strong>To download your official admission letter:</strong></p>
          <ol style="padding-left:20px;">
            <li>Visit our <a href="$urlSafe" style="color:#0a3d8f;">Admission Letter page</a></li>
            <li>Enter your KCSE Index Number: <strong>$kcseIndex</strong></li>
            <li>Download your admission letter as a PDF</li>
          </ol>
          <p style="text-align:center;margin:24px 0;">
            <a href="$urlSafe" style="background:#0a3d8f;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block;">Download Admission Letter</a>
          </p>
          <p>Please read it carefully for your registration deadline and the documents you need to bring.</p>
          <p>Congratulations again, and welcome to Chanzeywe TVC.</p>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0">
          <p style="font-size:0.85rem;color:#6b7280;">
            Chanzeywe Vocational Training College<br>
            P.O. Box 413 - 50310, Vihiga County, Kenya<br>
            +254 740 932 743 | chanzeywetvc@gmail.com
          </p>
        </div>
        HTML;
    }
}
