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

// Map roleId to userType - Updated to match database
const roleIdToUserTypeMap: Record<number, UserType> = {
  3: "admin",
  4: "districtAdministrator",
  2: "sectorCoordinator",
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
          
          if (!response.token || !response.user) {
            throw new Error('Invalid response format: missing token or user data');
          }

          const { token, user } = response;
          
          // Map role ID to user type
          const userType = roleIdToUserTypeMap[user.roleId];
          console.log('🎭 Mapped userType:', userType, 'from roleId:', user.roleId);
          console.log('🗂️ Available role mappings:', roleIdToUserTypeMap);
          
          if (!userType) {
            console.error(`Invalid or missing roleId: ${user.roleId}`);
            throw new Error('Invalid role configuration');
          }

          // Store token in localStorage for API client
          localStorage.setItem('token', token);
          
          const newState = {
            userId: user.id?.toString(),
            userType,
            roleId: user.roleId,
            token,
            isAuthenticated: true,
            first_name: user.first_name || null,
            last_name: user.last_name || null,
            userEmail: user.email,
            username: user.username || null,
            gender: user.gender || null,
            profileImage: user.profileImage || null,
            phoneNumber: user.phoneNumber || null,
            agencyName: user.agencyName || null,
            sectorofOperations: user.sectorofOperations || null,
            position: userType,
          };
          
          console.log('💾 Setting new auth state:', newState);
          
          set(newState);
          
        } catch (error) {
          console.error("❌ Error logging in:", error);
          // Clean up on error
          localStorage.removeItem('token');
          set({ 
            isAuthenticated: false,
            token: null,
            userType: null,
            userId: null,
            roleId: null
          });
          throw error;
        }
      },
      logout: () => {
        console.log('🚪 Logging out user...');
        // Clean up token
        localStorage.removeItem('token');
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
      partialize: (state) => ({
        userId: state.userId,
        userType: state.userType,
        roleId: state.roleId,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        first_name: state.first_name,
        last_name: state.last_name,
        username: state.username,
        userEmail: state.userEmail,
        profileImage: state.profileImage,
        gender: state.gender,
        phoneNumber: state.phoneNumber,
        agencyName: state.agencyName,
        sectorofOperations: state.sectorofOperations,
        position: state.position,
      }),
    },
  ),
);