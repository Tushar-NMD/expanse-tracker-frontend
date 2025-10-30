import {
  Avatar,
  Box,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Divider,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { RiArrowDropDownLine } from "react-icons/ri";

function NavbarUI({ onToggleSidebar }) {
  return (
    <Box
      sx={{
        minWidth: "100vw",
        paddingY: "8px",
        paddingX: { xs: "16px", md: "60px" },
        boxSizing: "border-box",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "#F5FFFF",
        boxShadow: "0px 4px 4px rgba(0,0,0,0.25)",
        position: "fixed",
        top: 0,
        zIndex: 1000,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
        {/* ✅ Mobile menu button (hamburger icon) */}
        <IconButton
          onClick={onToggleSidebar}
          sx={{
            display: { xs: "block", md: "none" }, // only visible on mobile/tablet
            color: "#19A699", // ✅ change color here
            "&:hover": { backgroundColor: "rgba(25, 166, 153, 0.1)" }, // subtle hover effect
            padding: "6px",
          }}
        >
          <svg
            width="28"
            height="28"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </IconButton>

        {/* ✅ Logo */}
        <Typography
          color="#007E74"
          fontWeight={700}
          fontSize={{ xs: "15px", md: "28px" }}
          sx={{
            position: "relative",
            left: { xs: "-16px", md: "-24px" }, // moves left
          }}
        >
          Expense Tracker
        </Typography>
      </Box>

      {/* Profile + Dropdown area can come here later */}

      {/* Static Logout Confirmation Dialog (UI Only) */}
      <Dialog open={false}>
        <DialogContent>
          <Typography
            variant="h6"
            fontWeight={700}
            mb={2}
            textAlign="center"
            color="#0D2E28"
          >
            Confirm Logout
          </Typography>
          <Typography color="#616666" textAlign="center">
            You’ll need to login again to access admin panel.
          </Typography>
        </DialogContent>

        <DialogActions
          sx={{ display: "flex", justifyContent: "center", gap: "16px" }}
        >
          <Button
            variant="outlined"
            sx={{
              width: 416,
              height: 40,
              backgroundColor: "#CECEF2",
              borderColor: "#001580",
              color: "#001580",
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            sx={{
              width: 416,
              height: 40,
              backgroundColor: "#001580",
              color: "#FFFFFF",
            }}
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default NavbarUI;
