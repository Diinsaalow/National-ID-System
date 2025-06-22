// File: src/components/DeathRecords.jsx
import React, { useState, useEffect } from 'react';
import { FaSkullCrossbones, FaTrashAlt, FaEdit } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function DeathRecords({ onUpdateStats }) {
  const [deathRecords, setDeathRecords] = useState(() => {
    const stored = localStorage.getItem('death_records');
    return stored ? JSON.parse(stored) : [];
  });

  const [formData, setFormData] = useState({
    serialNumber: '',
    name: '',
    gender: '',
    dateOfDeath: '',
    location: '',
    reason: '',
  });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    localStorage.setItem('death_records', JSON.stringify(deathRecords));
    const today = new Date().toISOString().split('T')[0];
    const todaysDeaths = deathRecords.filter((rec) => rec.dateOfDeath === today);
    onUpdateStats?.({
      deathRecords: deathRecords.length,
      todaysDeathRequests: todaysDeaths.length,
    });
  }, [deathRecords]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setDeathRecords((prev) =>
        prev.map((record) =>
          record.id === editingId ? { ...formData, id: editingId } : record
        )
      );
      toast.success('Record updated successfully');
      setEditingId(null);
    } else {
      const id = `DR-${String(Date.now()).slice(-5)}`;
      setDeathRecords([...deathRecords, { ...formData, id }]);
      toast.success('Record added successfully');
    }
    setFormData({
      serialNumber: '',
      name: '',
      gender: '',
      dateOfDeath: '',
      location: '',
      reason: '',
    });
  };

  const handleEdit = (record) => {
    setFormData(record);
    setEditingId(record.id);
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm('Ma hubtaa inaad tirtirayso diiwaankan?');
    if (confirmed) {
      setDeathRecords(deathRecords.filter((record) => record.id !== id));
      toast.success('Record deleted successfully');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-10 bg-gradient-to-br from-red-50 to-white rounded-xl shadow-xl">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="flex items-center justify-between">
        <h2 className="text-4xl font-extrabold flex items-center gap-3 text-red-700">
          <FaSkullCrossbones className="text-5xl" /> Death Records
        </h2>
        <img
          src="https://ih1.redbubble.net/image.142145982.5575/st,small,507x507-pad,600x600,f8f8f8.u2.jpg"
          alt="Jamhuuria Somali"
          className="w-16 h-16 rounded-full shadow-lg border-2 border-red-400"
        />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input type="text" name="serialNumber" placeholder="Serial Number" className="p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400" value={formData.serialNumber} onChange={handleChange} required disabled={!!editingId} />
          <input type="text" name="name" placeholder="Full Name" className="p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400" value={formData.name} onChange={handleChange} required />
          <select name="gender" className="p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400" value={formData.gender} onChange={handleChange} required>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <input type="date" name="dateOfDeath" className="p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400" value={formData.dateOfDeath} onChange={handleChange} required />
          <input type="text" name="location" placeholder="Location" className="p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400" value={formData.location} onChange={handleChange} required />
          <input type="text" name="reason" placeholder="Reason of Death" className="p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400" value={formData.reason} onChange={handleChange} required />
        </div>
        <button type="submit" className={`w-full md:w-auto px-6 py-3 rounded-lg font-semibold shadow transition duration-200 ${editingId ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-red-600 hover:bg-red-700'} text-white`}>
          {editingId ? 'Update Record' : 'Add Record'}
        </button>
      </form>

      {/* Table */}
      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="min-w-full table-auto text-sm text-gray-700">
          <thead>
            <tr className="bg-red-200 text-red-800">
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Gender</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Location</th>
              <th className="px-4 py-3 text-left">Reason</th>
              <th className="px-4 py-3 text-left">Serial #</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {deathRecords.map((record, index) => (
              <tr key={record.id} className="border-b hover:bg-gray-50 transition">
                <td className="px-4 py-3">{index + 1}</td>
                <td className="px-4 py-3 font-medium">{record.name}</td>
                <td className="px-4 py-3">{record.gender}</td>
                <td className="px-4 py-3">{record.dateOfDeath}</td>
                <td className="px-4 py-3">{record.location}</td>
                <td className="px-4 py-3">{record.reason}</td>
                <td className="px-4 py-3">{record.serialNumber}</td>
                <td className="px-4 py-3 flex gap-3 items-center">
                  <button onClick={() => handleEdit(record)} className="text-yellow-600 hover:text-yellow-800 text-lg">
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDelete(record.id)} className="text-red-600 hover:text-red-800 text-lg">
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DeathRecords;
