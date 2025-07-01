// Zustand store for authentication state
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserType } from "@/types/types";
import { login } from "@/lib/api/api";

interface AuthState {
  userId: string | null;
  userType: UserType | null;
  roleId: number | null;
  token: string | null;
  isAuthenticated: boolean;
  first_name: string | null;
  last_name: string | null;
  username: string | null;
  userEmail: string | null;
  profileImage: string | null;
  gender: string | null;
  phoneNumber: string | null;
  agencyName: string | null;
  sectorofOperations: string | null;
  position: string | null;
  newPassword: string | null;
  confirmPassword: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Map roleId to userType - Updated to match your database
const roleIdToUserTypeMap: Record<number, UserType> = {
  2: "admin",  
  3: "districtAdministrator",            
  1: "sectorCoordinator",      
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      userId: null,
      userType: null,
      roleId: null,
      token: null,
      isAuthenticated: false,
      first_name: null,
      last_name: null,
      username: null,
      userEmail: null,
      profileImage: null,
      gender: null,
      phoneNumber: null,
      agencyName: null,
      sectorofOperations: null,
      position: null,
      newPassword: null,
      confirmPassword: null,
      login: async (email, password) => {
        try {
          console.log('🔐 Starting login process...');
          
          const response = await login(email, password);
          console.log('📡 Full API Response:', response);
          
          // Extract what we know exists from your database query
          const {
            message,
            token,
            roleId,
            first_name,
            last_name,
            profileImage,
          } = response;
          
          // Use response.id as userId since your DB returns "id"
          const userId = response.userId || response.id;
          
          // Set defaults for fields that might not exist
          const gender = response.gender || null;
          const username = response.username || null;
          const phoneNumber = response.phoneNumber || null;
          const agencyName = response.agencyName || null;
          const sectorofOperations = response.sectorofOperations || null;
          const position = response.position || null;
          
          const userType = roleIdToUserTypeMap[roleId] || null;
          console.log('🎭 Mapped userType:', userType, 'from roleId:', roleId);
          console.log('🗂️ Available role mappings:', roleIdToUserTypeMap);
          
          const userEmail = response.email || email;
          
          const newState = {
            userId: userId?.toString(),
            userType,
            roleId,
            token,
            isAuthenticated: true,
            first_name,
            last_name,
            userEmail,
            username,
            gender,
            profileImage,
            phoneNumber,
            agencyName,
            sectorofOperations,
            position: userType, 
          };
          
          console.log('💾 Setting new auth state:', newState);
          
          set(newState);
          
        } catch (error) {
          console.error("❌ Error logging in:", error);
          set({ isAuthenticated: false });
          throw error;
        }
      },
      logout: () => {
        console.log('🚪 Logging out user...');
        set({
          userId: null,
          userType: null,
          roleId: null,
          token: null,
          isAuthenticated: false,
          first_name: null,
          last_name: null,
          username: null,
          userEmail: null,
          profileImage: null,
          gender: null,
          phoneNumber: null,
          agencyName: null,
          sectorofOperations: null,
          position: null,
          newPassword: null,
          confirmPassword: null,
        });
      },
    }),
    {
      name: "auth-storage",
    },
  ),
);