import { getMeService, changePasswordService, changeUsernameService, requestRoleService, getUserProfileService, updateAboutMeService } from "../services/user.service.js";

const getMeController = async (req, res) => {
    try {
        const data = await getMeService(req.userId)

        if (!data.success) {
            return res.status(400).json({ success: false, message: data.message })
        }

        return res.status(200).json({ success: true, data: data.data })
    } catch (error) {
        console.log("Error in getMeController:", error)
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

const changePasswordController = async (req, res) => {
    const { currentPassword, newPassword, confirmNewPassword } = req.body

    if (!currentPassword || !newPassword || !confirmNewPassword) {
        return res.status(400).json({ success: false, message: "All fields are required" })
    }

    if (newPassword.length < 8) {
        return res.status(400).json({ success: false, message: "New password must be at least 8 characters long" })
    }

    if (newPassword !== confirmNewPassword) {
        return res.status(400).json({ success: false, message: "New passwords do not match" })
    }

    try {
        const data = await changePasswordService(req.userId, currentPassword, newPassword)

        if (!data.success) {
            return res.status(400).json({ success: false, message: data.message })
        }

        return res.status(200).json({ success: true, message: data.message })
    } catch (error) {
        console.log("Error in changePasswordController:", error)
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

const changeUsernameController = async (req, res) => {
    const { newUsername } = req.body

    if (!newUsername || newUsername.trim().length === 0) {
        return res.status(400).json({ success: false, message: "Username is required" })
    }

    try {
        const data = await changeUsernameService(req.userId, newUsername.trim())

        if (!data.success) {
            return res.status(400).json({ success: false, message: data.message })
        }

        return res.status(200).json({ success: true, message: data.message, username: data.username })
    } catch (error) {
        console.log("Error in changeUsernameController:", error)
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

const requestRoleController = async (req, res) => {
    const { roleName } = req.body

    if (!roleName) {
        return res.status(400).json({ success: false, message: "Role name is required" })
    }

    const allowedRoles = ["READER", "WRITER"]
    if (!allowedRoles.includes(roleName.toUpperCase())) {
        return res.status(400).json({ success: false, message: "Invalid role. Allowed roles: READER, WRITER" })
    }

    try {
        const data = await requestRoleService(req.userId, roleName.toUpperCase())

        if (!data.success) {
            return res.status(400).json({ success: false, message: data.message })
        }

        return res.status(201).json({ success: true, message: data.message })
    } catch (error) {
        console.log("Error in requestRoleController:", error)
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

const getUserProfileController = async (req, res) => {
    try {
        const data = await getUserProfileService(req.params.id);

        if (!data.success) {
            return res.status(404).json({ success: false, message: data.message });
        }

        return res.status(200).json({ success: true, data: data.data });
    } catch (error) {
        console.log("Error in getUserProfileController:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const updateAboutMeController = async (req, res) => {

    const { aboutMe } = req.body

    if (!aboutMe || aboutMe.trim().length === 0) {
        return res.status(400).json({ success: false, message: "About me is required" })
    }

    try {
        const data = await updateAboutMeService(aboutMe.trim(), req.userId)

        if (!data.success) {
            return res.status(400).json({ success: false, message: data.message })
        }

        return res.status(200).json({ success: true, message: data.message, aboutMe: data.aboutMe })
    } catch (error) {
        console.log("Error in updateAboutMeController:", error)
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

export { getMeController, changePasswordController, changeUsernameController, requestRoleController, getUserProfileController, updateAboutMeController }
