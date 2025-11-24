import axios from "axios";

async function login(email, password) {
    try {

        const response = await axios.post('http://localhost:3000/api/auth/login', { email, password }, { withCredentials: true });

        const userRole = response.data.message.role;

        if (userRole === 'student') {
            window.location.href = '/student';
        } else if (userRole === 'company') {
            window.location.href = '/company';
        }
        return { success: true, message: "Login successful."
        };
        
    } catch (error) {
        console.error("Error during login:", error);
        return { success: false, message: "An error occurred. Please try again." };
    }
}

const isLoggedIn = async () => {
    try{
       
    }catch  (error){
        console.log("Error during Authorization", error);

    }
}
 
export { login };
