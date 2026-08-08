import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer/Footer";
import "./Application.css";
import { apiPostForm } from "../../utils/api";
import useSeo from "../../utils/useSeo";
import {
  FaUser, FaGraduationCap, FaPhone, FaUpload,
  FaCheckCircle, FaChevronRight, FaArrowLeft,
  FaFileAlt, FaBuilding, FaExclamationCircle,
  FaEnvelopeOpenText,
} from "react-icons/fa";

/* ─── Steps (3 fill steps only — no review step) ─── */
const STEPS = [
  { label: "Personal Details",  icon: <FaUser /> },
  { label: "Academic Info",     icon: <FaGraduationCap /> },
  { label: "Contact & Docs",    icon: <FaPhone /> },
];

/* ─── Initial form state ─── */
const INIT = {
  // Step 0
  fullName: "", gender: "", email: "", dob: "",
  nationality: "", idNumber: "",
  // Step 1
  school: "", kcseIndex: "", kcseYear: "", grade: "",
  prevCert: "", specialNeeds: "",
  // Step 2
  studentPhone: "", guardianPhone: "", address: "",
};

/* ─── Validation rules per step ─── */
const RULES = {
  0: {
    fullName:     { required: true, label: "Full Name" },
    gender:       { required: true, label: "Gender" },
    email:        { required: true, label: "Email Address", pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, patternMsg: "Enter a valid email" },
    dob:          { required: true, label: "Date of Birth" },
  },
  1: {
    school:       { required: true, label: "Secondary School" },
    kcseIndex:    { required: true, label: "KCSE Index Number", pattern: /^\d{11}\/\d{4}$/, patternMsg: "Enter your index number as 11 digits / year, e.g. 29513204036/2024" },
    grade:        { required: true, label: "KCSE Mean Grade" },
    kcseYear:     { required: false, label: "KCSE Year", isNumber: true, min: 2000, max: new Date().getFullYear(), numMsg: "Enter a valid year (2000 – present)" },
  },
  2: {
    studentPhone:  { required: true, label: "Student Phone", isPhone: true, phoneMsg: "Enter a valid phone number (e.g. +254 700 000 000)" },
    guardianPhone: { required: true, label: "Guardian Phone", isPhone: true, phoneMsg: "Enter a valid phone number" },
  },
};

const phoneRx = /^(\+?254|0)[17]\d{8}$/;

const MAX_FILE_MB = 5;
const ALLOWED_EXT = [".pdf", ".jpg", ".jpeg", ".png"];
const isAllowedFile = (file) => {
  const name = file.name.toLowerCase();
  return ALLOWED_EXT.some(ext => name.endsWith(ext));
};

const UPLOADS = [
  { key: "result", label: "KCSE Result Slip",                required: true,  hint: "PDF or image of your result slip" },
  { key: "cert",   label: "KCSE Certificate (if available)", required: false, hint: "PDF or image" },
  { key: "id",     label: "ID / Birth Certificate",          required: true,  hint: "PDF or image" },
];

/* Computed once at module load rather than inline during render —
   `new Date()` there is an impure call the render function shouldn't
   perform on every re-render. */
const MAX_DOB = new Date(Date.now() - 15 * 365.25 * 86400000).toISOString().split("T")[0];

function validate(step, data) {
  const errors = {};
  const rules  = RULES[step] || {};
  for (const [key, rule] of Object.entries(rules)) {
    const val = (data[key] || "").toString().trim();
    if (rule.required && !val) {
      errors[key] = `${rule.label} is required`;
      continue;
    }
    if (val && rule.pattern && !rule.pattern.test(val)) {
      errors[key] = rule.patternMsg;
      continue;
    }
    if (val && rule.isPhone && !phoneRx.test(val.replace(/\s/g, ""))) {
      errors[key] = rule.phoneMsg;
      continue;
    }
    if (val && rule.isNumber) {
      const n = Number(val);
      if (isNaN(n) || n < rule.min || n > rule.max) {
        errors[key] = rule.numMsg;
      }
    }
  }
  return errors;
}

/* ─── Field component ─── */
const Field = ({ label, required, hint, error, children }) => (
  <div className={`app-field${error ? " app-field--error" : ""}`}>
    <label>
      {label}
      {required && <span className="app-req"> *</span>}
      {hint && <span className="app-hint"> — {hint}</span>}
    </label>
    {children}
    {error && (
      <span className="app-error-msg">
        <FaExclamationCircle /> {error}
      </span>
    )}
  </div>
);

/* ─── Main component ─── */
const ApplicationForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const course   = location.state;

  const [step,        setStep]        = useState(0);
  const [form,        setForm]        = useState(INIT);
  const [errors,      setErrors]      = useState({});
  const [files,       setFiles]       = useState({ result: null, cert: null, id: null });
  const [fileErrors,  setFileErrors]  = useState({});
  const [declared,    setDeclared]    = useState(false);
  const [submitted,   setSubmitted]   = useState(false);
  const [submitting,  setSubmitting]  = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");

  useSeo({
    title: "Apply Now",
    description: "Apply online for a diploma, certificate or artisan course at Chanzeywe Vocational Training College, Vihiga, Kenya.",
    noIndex: true,
  });

  const set = (key) => (e) =>
    setForm(prev => ({ ...prev, [key]: e.target.value }));

  const handleFile = (key) => (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (!isAllowedFile(f)) {
      setFileErrors(prev => ({ ...prev, [key]: "Only PDF, JPG or PNG files are allowed" }));
      return;
    }
    if (f.size > MAX_FILE_MB * 1024 * 1024) {
      setFileErrors(prev => ({ ...prev, [key]: `File is too large — max ${MAX_FILE_MB}MB` }));
      return;
    }
    setFileErrors(prev => ({ ...prev, [key]: null }));
    setFiles(prev => ({ ...prev, [key]: f }));
  };

  const submit = async () => {
    setSubmitting(true);
    setSubmitError("");
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append("courseId", course.id);
      if (files.result) fd.append("result", files.result);
      if (files.cert)   fd.append("cert", files.cert);
      if (files.id)     fd.append("id", files.id);

      const result = await apiPostForm("/applications.php", fd);
      setReferenceNumber(result.referenceNumber || "");
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err.message || "Something went wrong submitting your application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const next = () => {
    const errs = validate(step, form);

    /* Last step also gates on required documents + the honesty
       declaration — previously unenforced, since there was no
       <form> wrapper and the button was type="button", so the
       checkbox's `required` attribute never actually fired. */
    if (step === STEPS.length - 1) {
      UPLOADS.forEach(u => {
        if (u.required && !files[u.key]) errs[u.key] = `${u.label} is required`;
      });
      if (!declared) errs.declaration = "Please confirm the declaration to continue";
    }

    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    if (step === STEPS.length - 1) {
      submit();
    } else {
      setStep(s => s + 1);
    }
  };

  const back = () => {
    setErrors({});
    setStep(s => s - 1);
  };

  /* ─── No course selected ─── */
  if (!course) {
    return (
      <>
        <Navbar />
        <div className="app-no-course">
          <div className="app-no-course__icon"><FaFileAlt /></div>
          <h2>No Course Selected</h2>
          <p>Please select a course from the courses page to begin your application.</p>
          <button onClick={() => navigate("/courses")} className="app-state-btn">
            <FaArrowLeft /> Back to Courses
          </button>
        </div>
        <Footer />
      </>
    );
  }

  /* ─── Success screen ─── */
  if (submitted) {
    return (
      <>
        <Navbar />
        <div className="app-success">
          <div className="app-success__icon"><FaCheckCircle /></div>
          <h2>Thank You for Applying!</h2>
          <p>
            Your application to <strong>{course.title}</strong> at
            Chanzeywe TVC has been received and is now under review.
          </p>

          {referenceNumber && (
            <div className="app-success__reference">
              <span>Your Reference Number</span>
              <strong>{referenceNumber}</strong>
            </div>
          )}

          <p className="app-success__notice">
            <FaEnvelopeOpenText /> Keep checking your email ({form.email}) for a response —
            we'll notify you there once your application has been reviewed, including your
            official offer letter if accepted.
          </p>

          <div className="app-success__details">
            <div className="app-success__detail-item">
              <span>Course</span><strong>{course.title}</strong>
            </div>
            <div className="app-success__detail-item">
              <span>Department</span><strong>{course.department}</strong>
            </div>
            <div className="app-success__detail-item">
              <span>Level</span><strong>{course.level}</strong>
            </div>
            <div className="app-success__detail-item">
              <span>Code</span><strong>{course.code}</strong>
            </div>
          </div>
          <button onClick={() => navigate("/courses")} className="app-state-btn">
            Back to Courses
          </button>
        </div>
        <Footer />
      </>
    );
  }

  /* ─── Main form ─── */
  const e = errors; // shorthand

  return (
    <>
      <Navbar />

      {/* Institute header */}
      <section className="app-institute-header">
        <div className="app-institute-header__overlay" />
        <div className="app-institute-header__rings" />
        <div className="app-institute-header__content">
          <h1>Chanzeywe Vocational Training College</h1>
          <p className="app-institute-header__tagline">Skills to Transform Livelihoods — Vihiga County</p>
          <div className="app-institute-header__contacts">
            <span>P.O. Box 413 – 50310 Vihiga</span>
            <span className="app-sep">·</span>
            <span>+254 740 932 743</span>
            <span className="app-sep">·</span>
            <span>chanzeywetvc@gmail.com</span>
          </div>
          <div className="app-breadcrumb">
            <Link to="/">Home</Link>
            <FaChevronRight />
            <Link to="/courses">Courses</Link>
            <FaChevronRight />
            <span>Application Form</span>
          </div>
        </div>
      </section>

      <div className="app-page">

        {/* Course banner */}
        <div className="app-course-banner">
          <div className="app-course-banner__icon"><FaBuilding /></div>
          <div className="app-course-banner__info">
            <span className="app-course-banner__label">Applying For</span>
            <strong>{course.title}</strong>
          </div>
          <div className="app-course-banner__meta">
            <span>{course.department}</span>
            <span className="app-dot" />
            <span>{course.level}</span>
            <span className="app-dot" />
            <span>Code: <strong>{course.code}</strong></span>
          </div>
        </div>

        {/* Stepper */}
        <div className="app-stepper">
          {STEPS.map((s, i) => (
            <React.Fragment key={i}>
              <div className={`app-step${i === step ? " app-step--active" : ""}${i < step ? " app-step--done" : ""}`}>
                <span className="app-step__num">
                  {i < step ? <FaCheckCircle /> : i + 1}
                </span>
                <span className="app-step__label">{s.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`app-step__line${i < step ? " app-step__line--done" : ""}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Form card */}
        <div className="app-form-card">

          {/* ── STEP 0: Personal Details ── */}
          {step === 0 && (
            <div className="app-section">
              <div className="app-section__header">
                <div className="app-section__icon"><FaUser /></div>
                <div>
                  <span className="app-eyebrow">Step 1 of 3</span>
                  <h2>Personal Details</h2>
                </div>
              </div>

              <div className="app-row">
                <Field label="Full Name" required error={e.fullName}>
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={set("fullName")}
                    placeholder="e.g. John Mwangi"
                    className={e.fullName ? "input-error" : ""}
                  />
                </Field>
                <Field label="Gender" required error={e.gender}>
                  <select
                    value={form.gender}
                    onChange={set("gender")}
                    className={e.gender ? "input-error" : ""}
                  >
                    <option value="">Select gender</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Prefer not to say</option>
                  </select>
                </Field>
              </div>

              <div className="app-row">
                <Field label="Email Address" required error={e.email}>
                  <input
                    type="email"
                    value={form.email}
                    onChange={set("email")}
                    placeholder="you@example.com"
                    className={e.email ? "input-error" : ""}
                  />
                </Field>
                <Field label="Date of Birth" required hint="must be 15 years+" error={e.dob}>
                  <input
                    type="date"
                    value={form.dob}
                    onChange={set("dob")}
                    max={MAX_DOB}
                    className={e.dob ? "input-error" : ""}
                  />
                </Field>
              </div>

              <div className="app-row">
                <Field label="Nationality">
                  <input
                    type="text"
                    value={form.nationality}
                    onChange={set("nationality")}
                    placeholder="e.g. Kenyan"
                  />
                </Field>
                <Field label="National ID / Birth Certificate No.">
                  <input
                    type="text"
                    value={form.idNumber}
                    onChange={set("idNumber")}
                    placeholder="ID or birth cert number"
                  />
                </Field>
              </div>
            </div>
          )}

          {/* ── STEP 1: Academic Info ── */}
          {step === 1 && (
            <div className="app-section">
              <div className="app-section__header">
                <div className="app-section__icon app-section__icon--green"><FaGraduationCap /></div>
                <div>
                  <span className="app-eyebrow">Step 2 of 3</span>
                  <h2>Academic Information</h2>
                </div>
              </div>

              <Field label="Secondary School Attended" required error={e.school}>
                <input
                  type="text"
                  value={form.school}
                  onChange={set("school")}
                  placeholder="e.g. Vihiga High School"
                  className={e.school ? "input-error" : ""}
                />
              </Field>

              <div className="app-row">
                <Field label="KCSE Index Number" required hint="you'll use this to download your admission letter later" error={e.kcseIndex}>
                  <input
                    type="text"
                    value={form.kcseIndex}
                    onChange={set("kcseIndex")}
                    placeholder="e.g. 29513204036/2024"
                    className={e.kcseIndex ? "input-error" : ""}
                  />
                </Field>
                <Field label="KCSE Year" error={e.kcseYear}>
                  <input
                    type="number"
                    value={form.kcseYear}
                    onChange={set("kcseYear")}
                    placeholder="e.g. 2023"
                    min="2000"
                    max={new Date().getFullYear()}
                    className={e.kcseYear ? "input-error" : ""}
                  />
                </Field>
              </div>

              <div className="app-row">
                <Field label="KCSE Mean Grade" required error={e.grade}>
                  <select
                    value={form.grade}
                    onChange={set("grade")}
                    className={e.grade ? "input-error" : ""}
                  >
                    <option value="">Select grade</option>
                    {["A","A-","B+","B","B-","C+","C","C-","D+","D","D-","E"].map(g => (
                      <option key={g}>{g}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Previous Certificate (if any)">
                  <input
                    type="text"
                    value={form.prevCert}
                    onChange={set("prevCert")}
                    placeholder="e.g. Craft Certificate in Electrical"
                  />
                </Field>
              </div>

              <Field label="Special Needs / Disability">
                <input
                  type="text"
                  value={form.specialNeeds}
                  onChange={set("specialNeeds")}
                  placeholder="Leave blank if none"
                />
              </Field>
            </div>
          )}

          {/* ── STEP 2: Contact & Documents ── */}
          {step === 2 && (
            <div className="app-section">
              <div className="app-section__header">
                <div className="app-section__icon app-section__icon--amber"><FaPhone /></div>
                <div>
                  <span className="app-eyebrow">Step 3 of 3</span>
                  <h2>Contact & Documents</h2>
                </div>
              </div>

              <div className="app-row">
                <Field label="Student Phone" required hint="e.g. +254 7XX XXX XXX" error={e.studentPhone}>
                  <input
                    type="tel"
                    value={form.studentPhone}
                    onChange={set("studentPhone")}
                    placeholder="+254 700 000 000"
                    className={e.studentPhone ? "input-error" : ""}
                  />
                </Field>
                <Field label="Parent / Guardian Phone" required error={e.guardianPhone}>
                  <input
                    type="tel"
                    value={form.guardianPhone}
                    onChange={set("guardianPhone")}
                    placeholder="+254 700 000 000"
                    className={e.guardianPhone ? "input-error" : ""}
                  />
                </Field>
              </div>

              <Field label="Postal Address">
                <input
                  type="text"
                  value={form.address}
                  onChange={set("address")}
                  placeholder="e.g. P.O. Box 100, Vihiga"
                />
              </Field>

              {/* File uploads */}
              <div className="app-uploads">
                <p className="app-uploads__title">Required Documents</p>
                <p className="app-uploads__sub">Upload PDF, JPG or PNG. Max {MAX_FILE_MB}MB each.</p>

                {UPLOADS.map((u) => {
                  const err = fileErrors[u.key] || e[u.key];
                  return (
                    <div key={u.key}>
                      <label
                        className={`app-upload-zone${files[u.key] ? " app-upload-zone--done" : ""}${err ? " app-upload-zone--error" : ""}`}
                      >
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          style={{ display: "none" }}
                          onChange={handleFile(u.key)}
                        />
                        <div className="app-upload-zone__icon">
                          {files[u.key]
                            ? <FaCheckCircle style={{ color: "#16a34a" }} />
                            : <FaUpload />}
                        </div>
                        <div className="app-upload-zone__text">
                          <strong>{u.label}{u.required && <span className="app-req"> *</span>}</strong>
                          <span>{files[u.key] ? files[u.key].name : u.hint}</span>
                        </div>
                        <span className="app-upload-zone__btn">
                          {files[u.key] ? "Change" : "Browse"}
                        </span>
                      </label>
                      {err && (
                        <span className="app-error-msg">
                          <FaExclamationCircle /> {err}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Declaration */}
              <div>
                <label className={`app-declaration${e.declaration ? " app-declaration--error" : ""}`}>
                  <input
                    type="checkbox"
                    checked={declared}
                    onChange={ev => setDeclared(ev.target.checked)}
                  />
                  <span>
                    I confirm that all information provided in this application is
                    accurate and complete to the best of my knowledge.
                  </span>
                </label>
                {e.declaration && (
                  <span className="app-error-msg">
                    <FaExclamationCircle /> {e.declaration}
                  </span>
                )}
              </div>

              {submitError && (
                <div className="app-submit-error">
                  <FaExclamationCircle /> {submitError}
                </div>
              )}
            </div>
          )}

          {/* ── Navigation ── */}
          <div className="app-nav">
            {step > 0 ? (
              <button type="button" className="app-nav__back" onClick={back} disabled={submitting}>
                <FaArrowLeft /> Previous
              </button>
            ) : (
              <div />
            )}

            <button type="button" className="app-nav__next" onClick={next} disabled={submitting}>
              {step === STEPS.length - 1
                ? (submitting
                    ? <>Submitting…</>
                    : <><FaCheckCircle style={{ fontSize: "0.85rem" }} /> Submit Application</>)
                : <>Next <FaChevronRight style={{ fontSize: "0.68rem" }} /></>
              }
            </button>
          </div>

        </div>{/* end app-form-card */}
      </div>

      <Footer />
    </>
  );
};

export default ApplicationForm;