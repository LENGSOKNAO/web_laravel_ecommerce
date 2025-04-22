import React, { useState } from "react";
import LayoutAdmin from "../../../Layouts/LayoutAdmin";
import { FaSave } from "react-icons/fa"; // Replace CiSave with FaSave

const Settings = () => {
  // Initial settings state
  const [settings, setSettings] = useState({
    customerStatuses: ["Active", "Block"],
    newStatus: "", // For adding new status
    currency: "USD",
    shopRateThreshold: 70, // Default threshold for shop rate (e.g., highlight if below this)
    allowCustomerDeletion: true, // Toggle for enabling/disabling customer deletion
    autoBlockAfterDays: 30, // Auto-block customers after X days of inactivity
  });

  // Handlers for updating settings
  const handleAddStatus = () => {
    if (settings.newStatus && !settings.customerStatuses.includes(settings.newStatus)) {
      setSettings((prev) => ({
        ...prev,
        customerStatuses: [...prev.customerStatuses, prev.newStatus],
        newStatus: "",
      }));
    }
  };

  const handleRemoveStatus = (status) => {
    if (settings.customerStatuses.length > 1) { // Ensure at least one status remains
      setSettings((prev) => ({
        ...prev,
        customerStatuses: prev.customerStatuses.filter((s) => s !== status),
      }));
    } else {
      alert("At least one status must remain.");
    }
  };

  const handleCurrencyChange = (e) => {
    setSettings((prev) => ({
      ...prev,
      currency: e.target.value,
    }));
  };

  const handleShopRateThresholdChange = (e) => {
    const value = Math.max(0, Math.min(100, Number(e.target.value))); // Ensure value is between 0 and 100
    setSettings((prev) => ({
      ...prev,
      shopRateThreshold: value,
    }));
  };

  const handleToggleDeletion = () => {
    setSettings((prev) => ({
      ...prev,
      allowCustomerDeletion: !prev.allowCustomerDeletion,
    }));
  };

  const handleAutoBlockDaysChange = (e) => {
    const value = Math.max(1, Number(e.target.value)); // Ensure value is at least 1
    setSettings((prev) => ({
      ...prev,
      autoBlockAfterDays: value,
    }));
  };

  const handleSaveSettings = () => {
    // In a real app, this would save to a backend or local storage
    alert("Settings saved successfully!");
    console.log("Saved Settings:", settings);
  };

  return (
    <LayoutAdmin>
      <div className="m-[0_0_50px_0] border-b-1 border-gray-200">
        <div className="px-6 py-2 bg-gray-100 text-gray-800">
          <h2 className="text-2xl font-bold mb-4">Settings</h2>

          {/* Customer Status Settings */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Customer Statuses</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {settings.customerStatuses.map((status) => (
                <div
                  key={status}
                  className="flex items-center gap-1 bg-gray-200 px-3 py-1 rounded-full text-sm text-gray-800"
                >
                  <span>{status}</span>
                  <button
                    onClick={() => handleRemoveStatus(status)}
                    className="text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={settings.newStatus}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, newStatus: e.target.value }))
                }
                placeholder="Add new status..."
                className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-600 w-64"
              />
              <button
                onClick={handleAddStatus}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-3 py-2 text-sm"
              >
                Add Status
              </button>
            </div>
          </div>

          {/* Currency Settings */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Currency Preference</h3>
            <select
              value={settings.currency}
              onChange={handleCurrencyChange}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-600"
            >
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="JPY">JPY - Japanese Yen</option>
            </select>
          </div>

          {/* Shop Rate Threshold */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Shop Rate Threshold</h3>
            <p className="text-sm text-gray-600 mb-2">
              Highlight customers with a shop rate below this threshold (0-100%).
            </p>
            <input
              type="number"
              value={settings.shopRateThreshold}
              onChange={handleShopRateThresholdChange}
              min="0"
              max="100"
              className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-600 w-24"
            />
            <span className="ml-2 text-sm text-gray-600">%</span>
          </div>

          {/* Customer Deletion Toggle */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Customer Deletion</h3>
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={settings.allowCustomerDeletion}
                onChange={handleToggleDeletion}
                className="w-4 h-4 text-blue-600 rounded border-gray-300"
              />
              Allow deletion of customers
            </label>
          </div>

          {/* Auto-Block Settings */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Auto-Block Customers</h3>
            <p className="text-sm text-gray-600 mb-2">
              Automatically block customers after a period of inactivity.
            </p>
            <input
              type="number"
              value={settings.autoBlockAfterDays}
              onChange={handleAutoBlockDaysChange}
              min="1"
              className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-600 w-24"
            />
            <span className="ml-2 text-sm text-gray-600">days</span>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSaveSettings}
              className="bg-green-600 hover:bg-green-700 text-white rounded-md px-4 py-2 text-sm flex items-center gap-1"
            >
              <FaSave size={16} /> Save Settings
            </button>
          </div>
        </div>
      </div>
    </LayoutAdmin>
  );
};

export default Settings;