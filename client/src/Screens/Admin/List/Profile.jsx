import React, { useState } from "react";
import LayoutAdmin from "../../../Layouts/LayoutAdmin";
import { FaSave, FaCamera } from "react-icons/fa";

const Profile = () => {
  // Initial admin profile state with background image
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Administrator",
    profilePicture: "https://picsum.photos/200?random=1",
    backgroundImage: "", // Initially empty; will be set by user upload
  });

  // State for editing profile
  const [editProfile, setEditProfile] = useState({
    name: profile.name,
    email: profile.email,
    profilePicture: profile.profilePicture,
    backgroundImage: profile.backgroundImage,
  });

  // State for password change
  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // State for toggling edit mode
  const [isEditing, setIsEditing] = useState(false);

  // Handlers for profile editing
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setEditProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditProfile((prev) => ({
          ...prev,
          profilePicture: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBackgroundImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditProfile((prev) => ({
          ...prev,
          backgroundImage: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    setProfile({
      ...profile,
      name: editProfile.name,
      email: editProfile.email,
      profilePicture: editProfile.profilePicture,
      backgroundImage: editProfile.backgroundImage,
    });
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  // Handlers for password change
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPassword((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSavePassword = () => {
    if (password.newPassword !== password.confirmPassword) {
      alert("New password and confirm password do not match!");
      return;
    }
    if (password.newPassword.length < 6) {
      alert("New password must be at least 6 characters long!");
      return;
    }
    // In a real app, this would validate the current password and update the password via a backend
    alert("Password updated successfully!");
    setPassword({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  return (
    <LayoutAdmin>
      <div className="m-[0_0_50px_0] border-b-1 border-gray-200">
        <div className="px-6 py-2 bg-gray-100 text-gray-800">
          <h2 className="text-2xl font-bold mb-4">Admin Profile</h2>

          {/* Profile Information Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Profile Information</h3>
            <div className="bg-white p-4 rounded-md shadow-sm">
              {/* Background Image Section */}
              <div
                className="relative w-full h-32 rounded-t-md bg-cover bg-center"
                style={{
                  backgroundImage: `url(${
                    isEditing ? editProfile.backgroundImage : profile.backgroundImage
                  })`,
                  backgroundColor: "#f28c38", // Fallback orange color if no background image
                }}
              >
                {isEditing && (
                  <label className="absolute top-2 right-2 bg-blue-600 text-white rounded-full p-2 cursor-pointer">
                    <FaCamera size={16} />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleBackgroundImageChange}
                    />
                  </label>
                )}
                {/* Profile Picture */}
                <div className="absolute -bottom-10 left-4">
                  <div className="relative">
                    <img
                      className="w-20 h-20 object-cover rounded-full border-4 border-white"
                      src={isEditing ? editProfile.profilePicture : profile.profilePicture}
                      alt="Profile"
                    />
                    {isEditing && (
                      <label className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 cursor-pointer">
                        <FaCamera size={16} />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleProfilePictureChange}
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              {/* Profile Details */}
              <div className="pt-12">
                <div className="flex items-center justify-between mb-4">
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={editProfile.name}
                      onChange={handleProfileChange}
                      className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-600 w-64"
                    />
                  ) : (
                    <h4 className="text-xl font-semibold text-gray-800">{profile.name}</h4>
                  )}
                  <p className="text-sm text-gray-600">{profile.role}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={editProfile.email}
                        onChange={handleProfileChange}
                        className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-600 w-full mt-1"
                      />
                    ) : (
                      <p className="text-sm text-gray-800 mt-1">{profile.email}</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end mt-4">
                  {isEditing ? (
                    <button
                      onClick={handleSaveProfile}
                      className="bg-green-600 hover:bg-green-700 text-white rounded-md px-4 py-2 text-sm flex items-center gap-1"
                    >
                      <FaSave size={16} /> Save Profile
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2 text-sm"
                    >
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Password Change Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Change Password</h3>
            <div className="bg-white p-4 rounded-md shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={password.currentPassword}
                    onChange={handlePasswordChange}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-600 w-full mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={password.newPassword}
                    onChange={handlePasswordChange}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-600 w-full mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={password.confirmPassword}
                    onChange={handlePasswordChange}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-600 w-full mt-1"
                  />
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={handleSavePassword}
                  className="bg-green-600 hover:bg-green-700 text-white rounded-md px-4 py-2 text-sm flex items-center gap-1"
                >
                  <FaSave size={16} /> Save Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutAdmin>
  );
};

export default Profile;