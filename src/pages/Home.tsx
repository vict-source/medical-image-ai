import {
  ArrowRight,
  BrainCircuit,
  FileImage,
  ShieldCheck,
  Activity,
  Stethoscope,
  Lock,
  Zap,
  BarChart3,
} from "lucide-react"
import { Link } from "react-router-dom"

export default function Home() {
  return (
    <main className="home-page">

      {/* HERO */}

      <section className="hero-section">

        <div className="hero-content">

          <div className="hero-badge">
            <BrainCircuit size={15} />
            BROWSER-BASED MEDICAL AI
          </div>

          <h1>
            AI-assisted
            <span> chest X-ray analysis.</span>
          </h1>

          <p>
            Analyze chest X-ray images directly in your browser
            using a trained ResNet18 deep learning model exported
            to ONNX. Upload an image, run inference, and receive
            a transparent classification with probability scores.
          </p>

          <div className="hero-actions">

            <Link
              to="/analysis"
              className="primary-action"
            >
              Start Analysis
              <ArrowRight size={17} />
            </Link>

            <a
              href="#how-it-works"
              className="secondary-action"
            >
              How it works
            </a>

          </div>

          <div className="hero-note">
            <ShieldCheck size={15} />

            AI-assisted analysis — not a substitute
            for professional medical diagnosis.

          </div>

        </div>


        {/* HERO VISUAL */}

        <div className="hero-visual">

          <div className="scan-card">

            <div className="scan-card-top">

              <span>
                CHEST X-RAY
              </span>

              <span className="live-status">

                <span />

                MODEL READY

              </span>

            </div>

            <div className="scan-placeholder">

              <Activity size={72} />

              <div className="scan-line" />

              <span>
                AI IMAGE ANALYSIS
              </span>

            </div>

            <div className="scan-card-bottom">

              <div>
                <small>MODEL</small>

                <strong>
                  ResNet18
                </strong>
              </div>

              <div>
                <small>RUNTIME</small>

                <strong>
                  ONNX
                </strong>
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* QUICK STATS */}

      <section className="capabilities-section">

        <div className="section-heading">

          <span>MODEL OVERVIEW</span>

          <h2>
            Built for fast, local inference.
          </h2>

          <p>
            The application combines deep learning with
            browser-based inference to provide an interactive
            chest X-ray classification workflow.
          </p>

        </div>


        <div className="capability-grid">

          <div className="capability-card">

            <div className="capability-icon">
              <BrainCircuit size={21} />
            </div>

            <h3>
              ResNet18 Model
            </h3>

            <p>
              A trained convolutional neural network is used
              to classify chest X-ray images.
            </p>

          </div>


          <div className="capability-card">

            <div className="capability-icon">
              <Zap size={21} />
            </div>

            <h3>
              Browser Inference
            </h3>

            <p>
              ONNX Runtime Web executes the model directly
              inside the browser.
            </p>

          </div>


          <div className="capability-card">

            <div className="capability-icon">
              <BarChart3 size={21} />
            </div>

            <h3>
              Probability Scores
            </h3>

            <p>
              The system converts model outputs into
              probabilities using softmax.
            </p>

          </div>


          <div className="capability-card">

            <div className="capability-icon">
              <Lock size={21} />
            </div>

            <h3>
              Client-Side Processing
            </h3>

            <p>
              The X-ray is processed locally in the browser
              instead of being sent to a remote inference server.
            </p>

          </div>

        </div>

      </section>


      {/* MODEL OUTPUT */}

      <section className="classes-section">

        <div className="classes-intro">

          <span>
            MODEL OUTPUT
          </span>

          <h2>
            Two classification categories.
          </h2>

          <p>
            The current trained model produces two output
            classes for chest X-ray classification.
          </p>

        </div>


        <div className="classes-list">

          <div className="class-item">

            <div className="class-number">
              01
            </div>

            <div>

              <h3>
                Normal
              </h3>

              <p>
                The model identifies the X-ray as belonging
                to the normal class.
              </p>

            </div>

          </div>


          <div className="class-item">

            <div className="class-number">
              02
            </div>

            <div>

              <h3>
                Pneumonia
              </h3>

              <p>
                The model identifies patterns associated
                with pneumonia in the X-ray.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* HOW IT WORKS */}

      <section
        className="workflow-section"
        id="how-it-works"
      >

        <div className="section-heading">

          <span>
            WORKFLOW
          </span>

          <h2>
            Four steps from image to prediction.
          </h2>

        </div>


        <div className="workflow-grid">

          <div className="workflow-step">

            <strong>
              01
            </strong>

            <h3>
              Upload
            </h3>

            <p>
              Select a chest X-ray image from your device.
            </p>

          </div>


          <div className="workflow-step">

            <strong>
              02
            </strong>

            <h3>
              Preprocess
            </h3>

            <p>
              The image is resized and normalized into
              the tensor format required by ResNet18.
            </p>

          </div>


          <div className="workflow-step">

            <strong>
              03
            </strong>

            <h3>
              Infer
            </h3>

            <p>
              ONNX Runtime Web executes the trained neural
              network locally in the browser.
            </p>

          </div>


          <div className="workflow-step">

            <strong>
              04
            </strong>

            <h3>
              Interpret
            </h3>

            <p>
              The output is converted into probabilities
              and presented as a classification result.
            </p>

          </div>

        </div>

      </section>


      {/* PRIVACY / PERFORMANCE */}

      <section className="capabilities-section">

        <div className="section-heading">

          <span>
            DESIGNED FOR THE BROWSER
          </span>

          <h2>
            Local processing. Simple workflow.
          </h2>

        </div>


        <div className="capability-grid">

          <div className="capability-card">

            <div className="capability-icon">
              <Lock size={21} />
            </div>

            <h3>
              Local Image Processing
            </h3>

            <p>
              Uploaded images are processed within the
              browser during inference.
            </p>

          </div>


          <div className="capability-card">

            <div className="capability-icon">
              <Zap size={21} />
            </div>

            <h3>
              No Inference Server
            </h3>

            <p>
              The application does not require a separate
              backend server to execute the trained model.
            </p>

          </div>


          <div className="capability-card">

            <div className="capability-icon">
              <BarChart3 size={21} />
            </div>

            <h3>
              Transparent Output
            </h3>

            <p>
              Both class probabilities are displayed rather
              than hiding the model's output distribution.
            </p>

          </div>


          <div className="capability-card">

            <div className="capability-icon">
              <FileImage size={21} />
            </div>

            <h3>
              Image-Based Workflow
            </h3>

            <p>
              The interface is designed specifically around
              chest X-ray image analysis.
            </p>

          </div>

        </div>

      </section>


      {/* CTA */}

      <section className="final-cta">

        <div>

          <Stethoscope size={28} />

          <h2>
            Ready to analyze an X-ray?
          </h2>

          <p>
            Upload an image and explore the model's
            classification output.
          </p>

        </div>


        <Link
          to="/analysis"
          className="primary-action"
        >
          Open Analysis
          <ArrowRight size={17} />
        </Link>

      </section>


      {/* DISCLAIMER */}

      <section className="final-cta">

        <div>

          <ShieldCheck size={24} />

          <h2>
            Research prototype
          </h2>

          <p>
            This application is intended for research
            and educational purposes. AI predictions
            should not be used as a standalone medical
            diagnosis.
          </p>

        </div>

      </section>

    </main>
  )
}