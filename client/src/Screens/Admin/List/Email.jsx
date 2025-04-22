import React, { useState } from "react";
import LayoutAdmin from "../../../Layouts/LayoutAdmin";
import { CiEdit, CiExport, CiSearch } from "react-icons/ci";
import { Link } from "react-router-dom";
import { IoAddSharp } from "react-icons/io5";
import { FaRegEye, FaStar, FaRegStar } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";

const Email = () => {
  const [listEmails, setListEmails] = useState([
    {
      id: "EM001",
      senderName: "George Thomas",
      senderImage: "https://picsum.photos/200?random=1",
      subject: "Request For Information",
      preview: "I hope you are doing well. I have a small request. Can you please...",
      date: "Jan 5, 3:45 PM",
      isStarred: true,
      unreadCount: 0,
    },
    {
      id: "EM002",
      senderName: "Robert C. Lane",
      senderImage: "https://picsum.photos/200?random=2",
      subject: "Invitation For Meeting",
      preview: "Good Morning, I hope this email finds you well. I am writing to extra...",
      date: "Mar 23, 7:30 AM",
      isStarred: true,
      unreadCount: 2,
    },
    {
      id: "EM003",
      senderName: "Dribbble",
      senderImage: "https://picsum.photos/200?random=3",
      subject: "Become a successful self-taught designer",
      preview: "There’s no one right way to learn design. In fa...",
      date: "Apr 10, 1:15 PM",
      isStarred: true,
      unreadCount: 0,
    },
    {
      id: "EM004",
      senderName: "Darren C. Gallimore",
      senderImage: "https://picsum.photos/200?random=4",
      subject: "Holiday Notice",
      preview: "Good Evening, I hope you are doing well. I have a small request...",
      date: "May 8, 9:45 PM",
      isStarred: true,
      unreadCount: 0,
    },
    {
      id: "EM005",
      senderName: "Mike A. Bell",
      senderImage: "https://picsum.photos/200?random=5",
      subject: "Offer Letter",
      preview: "Thank you for applying. I hope you are doing well. I have a small...",
      date: "Jun 16, 6:00 AM",
      isStarred: true,
      unreadCount: 0,
    },
    {
      id: "EM006",
      senderName: "Bennett C. Rice",
      senderImage: "https://picsum.photos/200?random=6",
      subject: "Apology Letter",
      preview: "I hope you are doing well. I have a small request. Can you please...",
      date: "Jun 16, 6:00 AM",
      isStarred: true,
      unreadCount: 4,
    },
    {
      id: "EM007",
      senderName: "John J. Bowser",
      senderImage: "https://picsum.photos/200?random=7",
      subject: "How to get started on Gitlab",
      preview: "We’re setting off on a freelancing journey can feel intim...",
      date: "Aug 22, 2:35 AM",
      isStarred: true,
      unreadCount: 3,
    },
    {
      id: "EM008",
      senderName: "Jill N. Neal",
      senderImage: "https://picsum.photos/200?random=8",
      subject: "Apply For Executive Position",
      preview: "I am writing to express my keen interest in the Executive Po...",
      date: "Aug 22, 2:35 AM",
      isStarred: true,
      unreadCount: 0,
    },
    {
      id: "EM009",
      senderName: "Instagram",
      senderImage: "https://picsum.photos/200?random=9",
      subject: "You have received 2 new followers",
      preview: "2 new followers, 1 new collected project, and more...",
      date: "Oct 31, 8:00 AM",
      isStarred: true,
      unreadCount: 0,
    },
    {
      id: "EM010",
      senderName: "Amazon",
      senderImage: "https://picsum.photos/200?random=10",
      subject: "Your order is shipped",
      preview: "Your order is on the way with tracking...",
      date: "Nov 19, 10:10 PM",
      isStarred: true,
      unreadCount: 1,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [filterStarred, setFilterStarred] = useState("all");
  const [showAllEmails, setShowAllEmails] = useState(false);
  const [selectedEmails, setSelectedEmails] = useState([]);
  const emailsPerPage = 10;

  // Filter emails based on search term and starred status
  const filteredEmails = listEmails.filter((email) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      email.senderName.toLowerCase().includes(searchLower) ||
      email.subject.toLowerCase().includes(searchLower) ||
      email.preview.toLowerCase().includes(searchLower) ||
      email.date.toLowerCase().includes(searchLower);

    const matchesStarred =
      filterStarred === "all" ||
      (filterStarred === "starred" && email.isStarred) ||
      (filterStarred === "unstarred" && !email.isStarred);

    return matchesSearch && matchesStarred;
  });

  // Sort filtered emails
  const sortEmails = (emails, key, direction) => {
    return [...emails].sort((a, b) => {
      const valueA = a[key] ? a[key].toString().toLowerCase() : "";
      const valueB = b[key] ? b[key].toString().toLowerCase() : "";
      return direction === "ascending"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    });
  };

  const sortedEmails = sortConfig.key
    ? sortEmails(filteredEmails, sortConfig.key, sortConfig.direction)
    : filteredEmails;

  // Pagination logic
  const indexOfLastEmail = currentPage * emailsPerPage;
  const indexOfFirstEmail = indexOfLastEmail - emailsPerPage;
  const currentEmails =
    showAllEmails && filterStarred === "all"
      ? sortedEmails
      : sortedEmails.slice(indexOfFirstEmail, indexOfLastEmail);
  const totalPages = Math.ceil(filteredEmails.length / emailsPerPage);

  // Handlers
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
    setSelectedEmails([]);
  };

  const handleFilterStarred = (status) => {
    setFilterStarred(status);
    setCurrentPage(1);
    setShowAllEmails(status === "all");
    setSelectedEmails([]);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const currentEmailIds = currentEmails.map((email) => email.id);
      setSelectedEmails(currentEmailIds);
    } else {
      setSelectedEmails([]);
    }
  };

  const handleSelectEmail = (emailId) => {
    setSelectedEmails((prev) =>
      prev.includes(emailId)
        ? prev.filter((id) => id !== emailId)
        : [...prev, emailId]
    );
  };

  const handleToggleStar = (emailId) => {
    setListEmails((prevEmails) =>
      prevEmails.map((email) =>
        email.id === emailId ? { ...email, isStarred: !email.isStarred } : email
      )
    );
  };

  const handleExport = () => {
    if (selectedEmails.length === 0) {
      alert("Please select at least one email to export.");
      return;
    }

    const emailsToExport = listEmails.filter((email) =>
      selectedEmails.includes(email.id)
    );

    const csvData = [
      ["Sender Name", "Subject", "Preview", "Date", "Starred"],
      ...emailsToExport.map((email) => [
        email.senderName,
        email.subject,
        email.preview,
        email.date,
        email.isStarred ? "Yes" : "No",
      ]),
    ];

    const csvContent = csvData.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "selected_emails_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const sortData = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
    setCurrentPage(1);
    setSelectedEmails([]);
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "ascending" ? " ↑" : " ↓";
    }
    return "";
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setSelectedEmails([]);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      setSelectedEmails([]);
    }
  };

  return (
    <LayoutAdmin>
      <div className="m-[0_0_50px_0] border-b-1 border-gray-200">
        <div className="px-6 py-2 bg-gray-100 text-gray-800">
          <h2 className="text-2xl font-bold mb-4">Emails</h2>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <button
              onClick={() => handleFilterStarred("all")}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                filterStarred === "all"
                  ? "bg-blue-100 text-blue-800"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              All ({listEmails.length})
            </button>
            <button
              onClick={() => handleFilterStarred("starred")}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                filterStarred === "starred"
                  ? "bg-blue-100 text-blue-800"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              Starred ({listEmails.filter((e) => e.isStarred).length})
            </button>
            <button
              onClick={() => handleFilterStarred("unstarred")}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                filterStarred === "unstarred"
                  ? "bg-blue-100 text-blue-800"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              Unstarred ({listEmails.filter((e) => !e.isStarred).length})
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="flex items-center border border-gray-300 rounded-md p-2">
              <CiSearch className="text-gray-500 mr-2" size={20} />
              <input
                className="border-none outline-none w-64 sm:w-80 text-sm"
                type="text"
                placeholder="Search emails..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={handleExport}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 flex items-center gap-1"
              >
                <CiExport size={16} /> Export
              </button>
              <Link
                to="/email/create"
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-3 py-2 text-sm flex items-center gap-1"
              >
                <IoAddSharp size={16} /> Compose Email
              </Link>
            </div>
          </div>
        </div>
        <div className="flex justify-center bg-white border-t-1 border-gray-200">
          <div className="w-[98%] overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b-1 border-gray-200">
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 rounded border-gray-300"
                      checked={
                        currentEmails.length > 0 &&
                        currentEmails.every((email) =>
                          selectedEmails.includes(email.id)
                        )
                      }
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase">
                    Star
                  </th>
                  <th
                    className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase cursor-pointer hover:bg-gray-100"
                    onClick={() => sortData("senderName")}
                  >
                    Sender {getSortIndicator("senderName")}
                  </th>
                  <th
                    className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase cursor-pointer hover:bg-gray-100"
                    onClick={() => sortData("subject")}
                  >
                    Subject {getSortIndicator("subject")}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase">
                    Preview
                  </th>
                  <th
                    className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase cursor-pointer hover:bg-gray-100"
                    onClick={() => sortData("date")}
                  >
                    Date {getSortIndicator("date")}
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-600 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentEmails.length > 0 ? (
                  currentEmails.map((email) => (
                    <tr
                      key={email.id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-blue-600 rounded border-gray-300"
                          checked={selectedEmails.includes(email.id)}
                          onChange={() => handleSelectEmail(email.id)}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleToggleStar(email.id)}
                          className="text-yellow-500"
                        >
                          {email.isStarred ? (
                            <FaStar size={16} />
                          ) : (
                            <FaRegStar size={16} />
                          )}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            className="w-8 h-8 object-cover rounded-full"
                            src={email.senderImage}
                            alt={email.senderName}
                          />
                          <span className="text-sm text-gray-800">
                            {email.senderName}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800">
                        {email.subject}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 truncate max-w-xs">
                        {email.preview}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800 flex items-center gap-2">
                        {email.date}
                        {email.unreadCount > 0 && (
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                            {email.unreadCount}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            className="p-2 rounded-full hover:bg-blue-100 transition"
                            title="View Email"
                          >
                            <FaRegEye className="text-blue-600" size={16} />
                          </button>
                          <button
                            className="p-2 rounded-full hover:bg-yellow-100 transition"
                            title="Edit Email"
                          >
                            <CiEdit className="text-yellow-600" size={16} />
                          </button>
                          <button
                            className="p-2 rounded-full hover:bg-red-100 transition"
                            title="Delete Email"
                          >
                            <RiDeleteBin6Line
                              className="text-red-600"
                              size={16}
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-gray-500">
                      No emails found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {!showAllEmails && (
              <div className="flex justify-between items-center p-4">
                <div className="text-sm text-gray-600">
                  {filteredEmails.length > 0
                    ? `1 to ${Math.min(10, filteredEmails.length)} of ${
                        filteredEmails.length
                      }`
                    : "No emails found"}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className={`p-1 ${
                      currentPage === 1
                        ? "opacity-50 cursor-not-allowed"
                        : "text-gray-600"
                    }`}
                  >
                    <GoChevronLeft size={16} />
                  </button>
                  <span className="text-sm text-gray-600">
                    {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className={`p-1 ${
                      currentPage === totalPages || totalPages === 0
                        ? "opacity-50 cursor-not-allowed"
                        : "text-gray-600"
                    }`}
                  >
                    <GoChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </LayoutAdmin>
  );
};

export default Email;