import bcrypt from "bcrypt"
import User from "../models/user.model.js"
import generateToken from "../util/generateTokens.js"
import Role from "../models/role.model.js"

const registerService = async(email, password, username, rolesRequested) => {
    try{
        const existingUser = await User.findOne({where: {email}})
        if(existingUser){
            return {success: false, message: "User already exists"}
        }

        const encryptedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({email, password: encryptedPassword, username})

        rolesRequested.map(async(role)=>{
            await Role.create({userId: user.id, roleName: role, isApproved: false})
        })

        const accessToken = await generateToken(user.id, user.email, user.username)

        return {success: true, message: "User registered successfully", data: user, accessToken}
    }catch(error){
        console.log(error);
        return {success: false, message: "Internal server error"}
    }
}

const loginService = async(email, password) => {
    try{
        const user = await User.findOne({where: {email}})
        if(!user){
            return {success: false, message: "User not found"}
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if(!isPasswordValid){
            return {success: false, message: "Invalid password"}
        }

        const accessToken = await generateToken(user.id, user.email, user.username)

        return {success: true, message: "User logged in successfully", data: user, accessToken}
    }catch(e){
        console.log(e);
        return {success: false, message: "Internal server error"}
    }
}

export {registerService, loginService}
