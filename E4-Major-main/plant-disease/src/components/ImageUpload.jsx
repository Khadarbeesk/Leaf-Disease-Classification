import React, { useState, useRef } from "react";
import axios from "axios";
import Modal from "react-modal";
import "./modal.css";

Modal.setAppElement("#root");

function ImageUploadModal() {
  const [showModal, setShowModal] = useState(false);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [zoom, setZoom] = useState(false);
  const inputRef = useRef();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
  };

  const formatLabel = (label) => {
    if (!label) return "";
    return label
      .replace(/___/g, " - ")
      .replace(/_/g, " ")
      .replace(/\(/g, "")
      .replace(/\)/g, "")
      .replace(/  +/g, " ")
      .trim();
  };

  const handlePredict = async () => {
    if (!image) return;
    const formData = new FormData();
    formData.append("file", image);
    formData.append("filename", image.name);

    setLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:8000/predict/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setResult({
        label: formatLabel(response.data.label),
        cause: response.data.cause,
        solution: response.data.solution,
        fertilizer: response.data.fertilizer, // We still fetch 'fertilizer' from backend
      });
    } catch (err) {
      console.error("Error during prediction:", err);
      setResult({
        label: "Prediction failed.",
        cause: "",
        solution: "",
        fertilizer: "",
      });
    }

    setLoading(false);
  };

  const highlightMainPart = (text) => {
    if (!text) return "";
    const mainPart = text.split(".")[0];
    const rest = text.substring(mainPart.length);
    return (
      <>
        <span style={{ color: "#4a90e2", fontWeight: "600" }}>{mainPart}.</span>
        {rest}
      </>
    );
  };

  return (
    <div className="mt-5">
      <button className="btn btn-primary btn-lg" onClick={() => setShowModal(true)}>
        <i className="bi bi-box-arrow-in-down-right me-2"></i> Get Started
      </button>

      <Modal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        contentLabel="Upload Image Modal"
        className="custom-modal"
        overlayClassName="custom-overlay"
        closeTimeoutMS={200}
      >
        <div className="modal-header justify-content-center border-bottom pb-3">
          <h4 className="modal-title">
            <i className="bi bi-cloud-upload-fill me-2 text-primary"></i> Upload Image
          </h4>
        </div>

        <div
          onClick={() => inputRef.current.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="drop-area mt-3"
        >
          <i className="bi bi-upload fs-1 text-secondary"></i>
          <p className="mb-0 text-muted">Click or Drag & Drop to Upload</p>
          <input
            type="file"
            accept="image/*"
            ref={inputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </div>

        {preview && (
          <>
            <p className="mt-3 text-center text-muted">
              <i className="bi bi-file-earmark-image me-1"></i> {image?.name}
            </p>

            <div className={`img-preview mt-2 ${zoom ? "zoom" : ""}`} onClick={() => setZoom(!zoom)}>
              <img
                src={preview}
                alt="Preview"
                className="img-fluid rounded shadow"
                style={{
                  maxHeight: "300px",
                  transition: "0.3s",
                  cursor: "pointer",
                  paddingTop: "10px",
                }}
              />
            </div>

            <div className="row mt-4 g-2">
              <div className="col-md-6">
                <center style={{ paddingTop: "10px" }}>
                  <button
                    className="btn btn-success w-100 fw-bold"
                    style={{ fontSize: "18px" }}
                    onClick={handlePredict}
                    disabled={loading}
                  >
                    <i className="bi bi-lightning-charge-fill me-2"></i>
                    {loading ? "Predicting..." : "Predict"}
                  </button>
                </center>
              </div>
              <div className="col-md-6">
                <center style={{ paddingTop: "10px" }}>
                  <button
                    className="btn btn-outline-danger w-100 fw-bold"
                    style={{ fontSize: "18px" }}
                    onClick={() => setShowModal(false)}
                  >
                    <i className="bi bi-x-lg me-2"></i> Close
                  </button>
                </center>
              </div>
            </div>
          </>
        )}

        {result && (
          <div className="result mt-4">
            <h5 className="mb-3">Prediction Result</h5>
            <p style={{ fontSize: "20px", fontWeight: "700" }}>
              <strong>Prediction:</strong> {result.label}
            </p>
            <p><strong>Cause:</strong> {highlightMainPart(result.cause)}</p>
            <p><strong>Solution:</strong> {highlightMainPart(result.solution)}</p>
            <p>
              <strong>Pesticide:</strong>{" "}
              <span style={{ color: "#7ed957", fontWeight: "600" }}>{result.fertilizer}</span>
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default ImageUploadModal;
