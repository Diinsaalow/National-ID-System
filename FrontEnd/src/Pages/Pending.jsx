import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaHourglassHalf, FaUserCircle } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

function PendingRequests() {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  const loadAllPending = async () => {
    try {
      const [birthsRes, idsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/births?status=pending'),
        axios.get('http://localhost:5000/api/ids?status=pending')
      ]);
      const combined = [...birthsRes.data, ...idsRes.data];
      setRequests(combined);
    } catch (err) {
      toast.error('❌ Failed to load pending records');
    }
  };

  useEffect(() => {
    loadAllPending();
  }, []);

  const handleApprove = async (id, type) => {
    try {
      const endpoint = type === 'ID Card' ? 'ids' : 'births';
      await axios.patch(`http://localhost:5000/api/${endpoint}/${id}/status`, { status: 'approved' });
      toast.success('✅ Approved successfully');
      navigate('/verified-users');
    } catch {
      toast.error('❌ Failed to approve');
    }
  };

  const handleReject = async (id, type) => {
    const reason = prompt('Please enter rejection reason:');
    if (!reason) return;
    try {
      const endpoint = type === 'ID Card' ? 'ids' : 'births';
      await axios.patch(`http://localhost:5000/api/${endpoint}/${id}/status`, {
        status: 'rejected',
        reason
      });
      toast.success('❌ Rejected successfully');
      navigate('/rejected-cases');
    } catch {
      toast.error('❌ Failed to reject');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <ToastContainer />
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3 text-yellow-600">
          <FaHourglassHalf className="text-3xl" />
          <h2 className="text-2xl sm:text-3xl font-bold">Pending Requests</h2>
        </div>
      </div>

      <div className="bg-white shadow-xl rounded-xl overflow-x-auto">
        <table className="min-w-[1100px] w-full text-sm sm:text-base">
          <thead>
            <tr className="bg-yellow-100 text-yellow-800 text-left text-xs sm:text-sm uppercase">
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Certificate Type</th>
              <th className="px-4 py-3">ID Number</th>
              <th className="px-4 py-3">Nationality</th>
              <th className="px-4 py-3">Gender</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-6 text-gray-500">No pending requests</td>
              </tr>
            ) : (
              requests.map((r, i) => (
                <tr key={r._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">{i + 1}</td>
                  <td className="px-4 py-3 flex items-center gap-2 text-gray-800">
                    <FaUserCircle className="text-yellow-600" /> {r.fullName}
                  </td>
                  <td className="px-4 py-3 text-blue-700 font-medium">{r.type}</td>

                  {/* ID Number: Show if exists or show N/A */}
                  <td className="px-4 py-3">
                    {r.idNumber || r.IDNumber || r.birthID || r.certificateNumber || 'N/A'}
                  </td>

                  <td className="px-4 py-3">{r.nationality || 'N/A'}</td>
                  <td className="px-4 py-3">{r.gender || 'N/A'}</td>
                  <td className="px-4 py-3">{r.email || 'N/A'}</td>

                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleApprove(r._id, r.type)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-xs"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(r._id, r.type)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-xs"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PendingRequests;
