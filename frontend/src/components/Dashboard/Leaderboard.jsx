import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import './Dashboard.css';

const Leaderboard = () => {
   const [ranks, setRanks] = useState([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchLeaderboard = async () => {
         try {
            const { data } = await axios.get('/dashboard/leaderboard');
            setRanks(data.leaderboard);
         } catch (err) {
            console.error(err);
         } finally {
            setLoading(false);
         }
      };
      fetchLeaderboard();
   }, []);

   if (loading) return <div>Loading rankings...</div>;

   return (
      <div className="leaderboard-page">
         <header className="page-header">
            <h1>Leaderboard 🏆</h1>
            <p>Top performing Hush AI ambassadors across all colleges.</p>
         </header>

         <div className="ranks-table-wrapper">
            <table className="ranks-table">
               <thead>
                  <tr>
                     <th>Rank</th>
                     <th>Ambassador</th>
                     <th>College</th>
                     <th>Signups</th>
                     <th>Clicks</th>
                  </tr>
               </thead>
               <tbody>
                  {ranks.map((row) => (
                     <tr key={row.rank} className={row.rank <= 3 ? `top-${row.rank}` : ''}>
                        <td>
                           <span className="rank-badge">#{row.rank}</span>
                        </td>
                        <td>
                           <div className="rank-user">
                              <img src={row.photoURL || 'https://via.placeholder.com/30'} alt="p" />
                              <span>{row.name}</span>
                           </div>
                        </td>
                        <td>{row.college}</td>
                        <td className="font-bold">{row.signups}</td>
                        <td className="text-muted">{row.clicks}</td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
   );
};

export default Leaderboard;
