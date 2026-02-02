import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Trash2, CheckCircle, XCircle } from 'lucide-react';
import '../../CSS/ManageResources.css'; // Reusing the clean table styles from manage page

export default function RequestHistory() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('request_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const clearHistory = () => {
    if(window.confirm("Clear all history?")) {
      localStorage.removeItem('request_history');
      setHistory([]);
    }
  };

  return (
    <div className="manage-page">
      <div className="manage-container">
        
        {/* Header */}
        <div className="manage-page-header">
          <div className="header-left">
            <button onClick={() => navigate('/hospital/dashboard')} className="back-btn">
              <ChevronLeft size={24} />
            </button>
            <div className="header-titles">
              <h1>Request History</h1>
              <p>Log of all approved and rejected requests</p>
            </div>
          </div>
          {history.length > 0 && (
            <button className="add-new-btn" style={{background: '#ef4444'}} onClick={clearHistory}>
              <Trash2 size={16} /> Clear Log
            </button>
          )}
        </div>

        {/* Content */}
        <div className="glass-panel" style={{padding: '0'}}>
          {history.length === 0 ? (
            <div style={{padding: '40px', textAlign: 'center', color: '#64748b'}}>
              No history available. Process some requests from the dashboard first.
            </div>
          ) : (
            <table className="history-table">
              <thead>
                <tr>
                  <th>Request Details</th>
                  <th>Type</th>
                  <th>Location</th>
                  <th>Price</th>
                  <th>Action Taken</th>
                  <th>Time Processed</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <div style={{fontWeight: '600', color:'#0f172a'}}>{item.title}</div>
                      <div style={{fontSize: '12px', color:'#64748b'}}>{item.subtitle}</div>
                    </td>
                    <td>
                        <span className="badge" style={{
                            background: item.type === 'lab' ? '#ecfdf5' : item.type === 'bed' ? '#fef2f2' : '#eff6ff',
                            color: item.type === 'lab' ? '#059669' : item.type === 'bed' ? '#dc2626' : '#2563eb'
                        }}>
                            {item.type.toUpperCase()}
                        </span>
                    </td>
                    <td>{item.location}</td>
                    <td>{item.price}</td>
                    <td>
                      {item.finalStatus === 'Approved' ? (
                        <span style={{display:'flex', alignItems:'center', gap:'6px', color:'#10b981', fontWeight:'600', fontSize:'13px'}}>
                          <CheckCircle size={16}/> Approved
                        </span>
                      ) : (
                        <span style={{display:'flex', alignItems:'center', gap:'6px', color:'#ef4444', fontWeight:'600', fontSize:'13px'}}>
                          <XCircle size={16}/> Rejected
                        </span>
                      )}
                    </td>
                    <td style={{fontSize:'12px', color:'#64748b'}}>{item.processedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
}