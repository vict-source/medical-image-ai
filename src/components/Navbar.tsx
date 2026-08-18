import { Link, NavLink } from "react-router-dom"
import {
  Activity,
  History,
  Home,
  ScanLine,
} from "lucide-react"

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-inner">

        {/* BRAND */}

        <Link
          to="/"
          className="navbar-brand"
        >
          <div className="brand-icon">
            <Activity size={19} />
          </div>

          <div className="brand-text">
            <strong>
              MedAI
            </strong>

            <span>
              Medical Image Analysis
            </span>
          </div>
        </Link>


        {/* NAVIGATION */}

        <nav className="navbar-links">

          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive
                ? "nav-link active"
                : "nav-link"
            }
          >
            <Home size={16} />
            <span>Home</span>
          </NavLink>


          <NavLink
            to="/analysis"
            className={({ isActive }) =>
              isActive
                ? "nav-link active"
                : "nav-link"
            }
          >
            <ScanLine size={16} />
            <span>Analysis</span>
          </NavLink>


          <NavLink
            to="/history"
            className={({ isActive }) =>
              isActive
                ? "nav-link active"
                : "nav-link"
            }
          >
            <History size={16} />
            <span>History</span>
          </NavLink>

        </nav>


        {/* MODEL STATUS */}

        <div className="navbar-status">

          <span />

          <div>
            <strong>
              Model Ready
            </strong>

            <small>
              ResNet18 · ONNX
            </small>
          </div>

        </div>

      </div>
    </header>
  )
}