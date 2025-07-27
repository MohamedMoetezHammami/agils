 import express from 'express'
import mysql from 'mysql'
import cors from 'cors'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const server = express();
server.use(cors());
server.use(express.json());

// MySQL connection setup
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // change as needed
    password: '', // change as needed
    database: 'test' // test database
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to database.');
});

// Get all missions
// server.get('/user', (req, res) => {
//     db.query('SELECT * FROM user', (err, results) => {
//         if (err) {
//             console.error(err);
//             return res.status(500).json({ error: 'Database error' });
//         }
//         res.json(results);
//     });
// });



// Get all personnel
server.get('/backoffice/liste_personnel', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error', details: err.message });
        return res.json(results);
    });
});

// Get count of all personnel
server.get('/api/backoffice/personnel/count', (req, res) => {
    db.query('SELECT COUNT(*) as count FROM users', (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error', details: err.message });
        return res.json({ count: results[0].count });
    });
});

// Get count of all vehicles
server.get('/api/backoffice/vehicles/count', (req, res) => {
    db.query('SELECT COUNT(*) as count FROM vehicule', (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error', details: err.message });
        return res.json({ count: results[0].count });
    });
});

// Update mission details and set vehicle status to available when mission is completed
server.put('/api/update-mission-details', (req, res) => {
    const { userId, dateMission, compteurDepart, compteurArrive, detailFrais } = req.body;
    
    if (!userId || !dateMission) {
        return res.status(400).json({ error: 'userId and dateMission are required' });
    }

    // Start a transaction to ensure both updates succeed or fail together
    db.beginTransaction(async (err) => {
        if (err) {
            console.error('Error starting transaction:', err);
            return res.status(500).json({ error: 'Database error', details: err.message });
        }

        try {
            // 1. First, get the mission to check if it has a vehicle assigned
            const [mission] = await new Promise((resolve, reject) => {
                db.query(
                    'SELECT id, Véhicule_id FROM mission WHERE user_id = ? AND date_mission = ?',
                    [userId, dateMission],
                    (err, results) => {
                        if (err) reject(err);
                        else resolve(results);
                    }
                );
            });

            if (!mission) {
                throw new Error('Mission not found');
            }

            // 2. Update the mission details
            await new Promise((resolve, reject) => {
                db.query(
                    'UPDATE mission SET Compteur_Départ = ?, Compteur_Arrivée = ?, détail_Frais = ? WHERE id = ?',
                    [compteurDepart, compteurArrive, JSON.stringify(detailFrais), mission.id],
                    (err) => {
                        if (err) reject(err);
                        else resolve(true);
                    }
                );
            });

            // 3. If the mission had a vehicle assigned, check its status and update to 'Disponible' if it's 'En mission'
            if (mission.vehicule) {
                // First, check the current status of the vehicle
                const [vehicle] = await new Promise((resolve, reject) => {
                    db.query(
                        'SELECT statut FROM vehicule WHERE id = ?',
                        [mission.Véhicule_id],
                        (err, results) => {
                            if (err) reject(err);
                            else resolve(results);
                        }
                    );
                });

                // Only update if the vehicle is currently 'En mission'
                if (vehicle && vehicle.statut === 'En mission') {
                    await new Promise((resolve, reject) => {
                        db.query(
                            'UPDATE vehicule SET statut = ? WHERE id = ?',
                            ['Disponible', mission.Véhicule_id],
                            (err) => {
                                if (err) reject(err);
                                else resolve(true);
                            }
                        );
                    });
                } else if (vehicle) {
                    console.log(`Vehicle ${mission.Véhicule_id} status is '${vehicle.statut}', not updating to 'Disponible'`);
                }
            }

            // Commit the transaction
            db.commit((err) => {
                if (err) {
                    return db.rollback(() => {
                        console.error('Error committing transaction:', err);
                        res.status(500).json({ error: 'Database error', details: 'Failed to commit transaction' });
                    });
                }
                res.json({ success: true, message: 'Mission details updated successfully' });
            });
        } catch (error) {
            // Rollback the transaction on error
            db.rollback(() => {
                console.error('Error updating mission details:', error);
                res.status(500).json({ 
                    error: 'Failed to update mission details', 
                    details: error.message 
                });
            });
        }
    });
});

// Get all vehicles with their current status and maintenance info
server.get('/backoffice/parc_automobile', (req, res) => {
    // First, let's check the structure of the vehicule table
    db.query('DESCRIBE vehicule', (describeErr, describeResults) => {
        if (describeErr) {
            console.error('Error describing vehicule table:', describeErr);
            return res.status(500).json({ error: 'Database error', details: 'Could not describe vehicule table' });
        }
        
        console.log('Vehicule table structure:', describeResults);
        
        // Use a more flexible query that selects all columns
        const sql = 'SELECT * FROM vehicule ORDER BY id ASC';
        
        db.query(sql, (err, results) => {
            if (err) {
                console.error('Error fetching vehicles:', err);
                return res.status(500).json({ error: 'Database error', details: err.message });
            }
            
            // Log the first row to see the actual structure
            if (results.length > 0) {
                console.log('First vehicle row:', results[0]);
            }
            
            return res.json(results);
        });
    });
});


// Insert a new mission
// server.post('/missions', (req, res) => {
//     const { retourMission, dateRetour, referenceMission, dateMission, compteurDepart, compteurArrive, kilometrageParcourus, retourFrais, fraisDeplacement } = req.body;
//     const sql = 'INSERT INTO missions (retourMission, dateRetour, referenceMission, dateMission, compteurDepart, compteurArrive, kilometrageParcourus, retourFrais, fraisDeplacement) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
//     db.query(sql, [retourMission, dateRetour, referenceMission, dateMission, compteurDepart, compteurArrive, kilometrageParcourus, retourFrais, fraisDeplacement], (err, result) => {
//         if (err) {
//             console.error(err);
//             return res.status(500).json({ error: 'Database error' });
//         }
//         res.status(201).json({ message: 'Mission added', id: result.insertId });
//     });
// });

// Login endpoint
server.post('/api/login', (req, res) => {
    try {
        const { nom_et_prenom, motDePasse } = req.body;
        if (!nom_et_prenom || !motDePasse) {
            return res.status(400).json({ message: 'Nom et prénom et mot de passe sont requis.' });
        }
        const sql = 'SELECT * FROM users WHERE nom_et_prenom = ?';
        db.query(sql, [nom_et_prenom], (err, results) => {
            if (err) {
                console.error('[DB ERROR] during user lookup:', err);
                return res.status(500).json({ message: 'Erreur interne du serveur (DB).' });
            }
            if (!results || results.length === 0) {
                return res.status(401).json({ message: 'Nom ou mot de passe invalide.' });
            }
            const users = results[0];
            // Compare motDePasse directly to the value from the database (e.g., users.motDePasse)
            if (!users.motDePasse || motDePasse !== users.motDePasse) {
                return res.status(401).json({ message: 'Nom ou mot de passe invalide.' });
            }
            try {
                const token = jwt.sign({ id: users.id, role: users.role }, 'agils123', { expiresIn: '1h' });
                res.json({ token, role: users.role });
            } catch (jwtErr) {
                console.error('[JWT ERROR] during token generation:', jwtErr);
                return res.status(500).json({ message: 'Erreur interne du serveur (JWT).' });
            }
        });
    } catch (mainCatchErr) {
        console.error('[MAIN CATCH ERROR]:', mainCatchErr);
        return res.status(500).json({ message: 'Erreur interne du serveur (main catch).' });
    }
});



// Add Employé endpoint
server.post('/api/employes', (req, res) => {
    const { nom_et_prenom, département, date_dembauche, email, telephone, employeeId, cin, role, manager_id } = req.body;
    if (!nom_et_prenom || !cin || !role || !date_dembauche || !telephone || !email || !département || !employeeId) {
        return res.status(400).json({ message: "Tous les champs obligatoires doivent être remplis." });
    }
    const sql = 'INSERT INTO users (id, nom_et_prenom, département, email, num_tel, cin, role, manager_id, date_embauche, motDePasse) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [employeeId, nom_et_prenom, département, email, telephone, cin, role, manager_id, date_dembauche, null], (err, result) => {
        if (err) {
            console.error('[DB ERROR] during employé insert:', err);
            return res.status(500).json({ message: "Erreur lors de l'ajout de l'employé." });
        }
        res.status(201).json({ message: "Employé ajouté avec succès !", id: result.insertId });
    });
});

// Add Vehicle endpoint
server.post('/api/vehicules', (req, res) => {
    const { marque, modele, matricule, puissance } = req.body;
    if (!marque || !modele || !matricule || !puissance) {
        return res.status(400).json({ message: "Tous les champs du véhicule sont obligatoires." });
    }
    const sql = 'INSERT INTO vehicule (id, immatriculation, marque_de_véhicule, modele_de_véhicule, statut, puissance) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(sql, ['vt0001', matricule, marque, modele, 'Disponible', puissance], (err, result) => {
        if (err) {
            console.error('[DB ERROR] during vehicle insert:', err);
            return res.status(500).json({ message: "Erreur lors de l'ajout du véhicule." });
        }
        res.status(201).json({ message: "Véhicule ajouté avec succès !", id: result.insertId });
    });
});

// Add Mission endpoint
server.post('/api/missions', (req, res) => {
    const {
        dateMission, dateDepart, heureDepart, depart, destination, dateRetour, heureRetour,
        objet, fraisMission, vehicule, departement, userId, immatriculation, vehicleId
    } = req.body;

    if (!dateMission || !dateDepart || !heureDepart || !dateRetour || !heureRetour ||
        !depart || !destination || !objet || !vehicule || !departement) {
        return res.status(400).json({ message: "Tous les champs de mission sont obligatoires." });
    }

    // Prepare SQL and values based on whether immatriculation is present
    let sql, values;
    if (vehicule === 'voiture de service' && immatriculation) {
        sql = `INSERT INTO mission
            (id, user_id, Véhicule_id, Date_Mission, Date_Sortie, Heure_Sortie, Départ, destination, Date_Retour, Heure_Retour, objet, Frais_de_Mission, statut, immatriculation, vehicule, departement)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        values = ['ms0005', userId, vehicleId, dateMission, dateDepart, heureDepart, depart, destination, dateRetour, heureRetour, objet, fraisMission, 'En attente', immatriculation, vehicule, departement];
    } else {
        sql = `INSERT INTO mission
            (id, user_id, Date_Mission, Date_Sortie, Heure_Sortie, Départ, destination, Date_Retour, Heure_Retour, objet, Frais_de_Mission, statut, vehicule, departement)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        values = ['ms0005', userId, dateMission, dateDepart, heureDepart, depart, destination, dateRetour, heureRetour, objet, fraisMission, 'En attente', vehicule, departement];
    }

    // Use transaction if vehicle status needs to be updated
    if (vehicule === 'voiture de service' && vehicleId) {
        db.beginTransaction((transErr) => {
            if (transErr) {
                console.error('[TRANSACTION ERROR]:', transErr);
                return res.status(500).json({ message: "Erreur lors de la transaction." });
            }

            // Insert mission
            db.query(sql, values, (err, result) => {
                if (err) {
                    return db.rollback(() => {
                        console.error('[DB ERROR] during mission insert:', err);
                        res.status(500).json({ message: "Erreur lors de l'ajout de la mission." });
                    });
                }

                // Update vehicle status
                const updateVehicleSql = "UPDATE vehicule SET statut = 'En attente' WHERE id = ?";
                db.query(updateVehicleSql, [vehicleId], (updateErr, updateResult) => {
                    if (updateErr) {
                        return db.rollback(() => {
                            console.error('[DB ERROR] during vehicle status update:', updateErr);
                            res.status(500).json({ message: "Erreur lors de la mise à jour du véhicule." });
                        });
                    }

                    // Commit transaction
                    db.commit((commitErr) => {
                        if (commitErr) {
                            return db.rollback(() => {
                                console.error('[COMMIT ERROR]:', commitErr);
                                res.status(500).json({ message: "Erreur lors de la validation de la transaction." });
                            });
                        }
                        res.status(201).json({ message: "Mission ajoutée avec succès", id: result.insertId });
                    });
                });
            });
        });
    } else {
        // Simple insert without transaction for non-service vehicles
        db.query(sql, values, (err, result) => {
            if (err) {
                console.error('[DB ERROR] during mission insert:', err);
                return res.status(500).json({ message: "Erreur lors de l'ajout de la mission." });
            }
            res.status(201).json({ message: "Mission ajoutée avec succès", id: result.insertId });
        });
    }
});

// Endpoint to get all vehicles with statut = 'Disponible'
server.get('/api/vehicules/disponibles', (req, res) => {
    const sql = "SELECT * FROM vehicule WHERE statut = 'Disponible'";
    db.query(sql, (err, results) => {
        if (err) {
            console.error('[DB ERROR] during fetching available vehicles:', err);
            return res.status(500).json({ message: "Erreur lors de la récupération des véhicules disponibles." });
        }
        res.status(200).json(results);
    });
});

// Get mission dates for a user and a mission date
server.get('/api/mission-dates', (req, res) => {
    const { userId, dateMission } = req.query;
    if (!userId || !dateMission) {
        return res.status(400).json({ error: 'userId and dateMission are required' });
    }
    const sql = `SELECT Date_Sortie, Heure_Sortie, Date_Retour, Heure_Retour, vehicule FROM mission WHERE user_id = ? AND Date_Mission = ? AND statut = 'Validée' LIMIT 1`;
    db.query(sql, [userId, dateMission], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error', details: err });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'No mission found for this user and date' });
        }
        res.json(results[0]);
    });
});

// Update Compteur_Départ, Compteur_Arrivée, détail_Frais for a validated mission
server.put('/api/update-mission-details', (req, res) => {
    const { userId, dateMission, compteurDepart, compteurArrive, detailFrais } = req.body;
    if (!userId || !dateMission) {
        return res.status(400).json({ error: 'userId and dateMission are required' });
    }
    const sql = `
        UPDATE mission
        SET Compteur_Départ = ?, Compteur_Arrivée = ?, détail_Frais = ?, statut_remb = ?
        WHERE user_id = ? AND Date_Mission = ? AND statut = 'Validée'
    `;
    db.query(sql, [compteurDepart, compteurArrive, JSON.stringify(detailFrais), 'En attente', userId, dateMission], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Database error', details: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'No validated mission found to update.' });
        }
        res.json({ success: true });
    });
});

server.get('/api/user-missions', (req, res) => {
    const { userId } = req.query;
    if (!userId) {
        return res.status(400).json({ error: 'userId is required' });
    }
    const sql = `SELECT * FROM mission WHERE user_id = ? ORDER BY Date_Mission DESC`;
    db.query(sql, [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error', details: err });
        }
        res.json(results);
    });
});

// Get all missions with statut = 'En attente' where the creator's manager_id = managerId
server.get('/api/manager/pending-missions', (req, res) => {
    const { managerId } = req.query;
    if (!managerId) {
        return res.status(400).json({ error: 'managerId is required' });
    }
    // Join users and mission, optionally vehicule for immatriculation
    const sql = `
        SELECT 
            mission.id,
            mission.Véhicule_id,
            mission.destination,
            mission.Date_Sortie,
            mission.Date_Retour,
            mission.objet,
            mission.Frais_de_Mission,
            mission.vehicule,
            mission.immatriculation,
            mission.statut,
            mission.statut_remb,
            users.nom_et_prenom,
            users.département
        FROM mission
        JOIN users ON mission.user_id = users.id
        WHERE mission.statut = ? AND users.manager_id = ?
        ORDER BY mission.Date_Mission DESC
    `;
    db.query(sql, ['En attente', managerId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error', details: err });
        }
        res.json(results);
    });
});

// Update mission status (statut) by manager (validate/refuse)
server.put('/api/manager/update-mission-status', (req, res) => {
    const { missionId, statut } = req.body;
    if (!missionId || !statut) {
        return res.status(400).json({ error: 'missionId and statut are required' });
    }

    // First, get the mission details to check if it has a vehicle
    const getMissionSql = 'SELECT Véhicule_id, vehicule FROM mission WHERE id = ?';
    db.query(getMissionSql, [missionId], (err, missionResults) => {
        if (err) {
            return res.status(500).json({ error: 'Database error', details: err });
        }
        if (missionResults.length === 0) {
            return res.status(404).json({ error: 'No mission found with this id.' });
        }

        const mission = missionResults[0];
        const vehicleId = mission.Véhicule_id;
        const vehicleType = mission.vehicule;

        // If mission has a service vehicle, use transaction to update both mission and vehicle status
        if (vehicleType === 'voiture de service' && vehicleId) {
            db.beginTransaction((transErr) => {
                if (transErr) {
                    console.error('[TRANSACTION ERROR]:', transErr);
                    return res.status(500).json({ error: 'Transaction error' });
                }

                // Update mission status
                const updateMissionSql = 'UPDATE mission SET statut = ? WHERE id = ?';
                db.query(updateMissionSql, [statut, missionId], (missionErr, missionResult) => {
                    if (missionErr) {
                        return db.rollback(() => {
                            console.error('[DB ERROR] during mission status update:', missionErr);
                            res.status(500).json({ error: 'Database error during mission update' });
                        });
                    }

                    // Determine vehicle status based on mission status
                    let vehicleStatus;
                    if (statut === 'Validée') {
                        vehicleStatus = 'En mission';
                    } else if (statut === 'Refusée') {
                        vehicleStatus = 'Disponible';
                    } else {
                        // For other statuses, don't change vehicle status
                        return db.commit((commitErr) => {
                            if (commitErr) {
                                return db.rollback(() => {
                                    console.error('[COMMIT ERROR]:', commitErr);
                                    res.status(500).json({ error: 'Transaction commit error' });
                                });
                            }
                            res.json({ success: true });
                        });
                    }

                    // Update vehicle status
                    const updateVehicleSql = 'UPDATE vehicule SET statut = ? WHERE id = ?';
                    db.query(updateVehicleSql, [vehicleStatus, vehicleId], (vehicleErr, vehicleResult) => {
                        if (vehicleErr) {
                            return db.rollback(() => {
                                console.error('[DB ERROR] during vehicle status update:', vehicleErr);
                                res.status(500).json({ error: 'Database error during vehicle update' });
                            });
                        }

                        // Commit transaction
                        db.commit((commitErr) => {
                            if (commitErr) {
                                return db.rollback(() => {
                                    console.error('[COMMIT ERROR]:', commitErr);
                                    res.status(500).json({ error: 'Transaction commit error' });
                                });
                            }
                            res.json({ success: true });
                        });
                    });
                });
            });
        } else {
            // Simple mission status update for non-service vehicles
            const updateMissionSql = 'UPDATE mission SET statut = ? WHERE id = ?';
            db.query(updateMissionSql, [statut, missionId], (err, result) => {
                if (err) {
                    return res.status(500).json({ error: 'Database error', details: err });
                }
                res.json({ success: true });
            });
        }
    });
});

// Get all missions with reimbursement data for financial dashboard
server.get('/api/financial/all-missions', (req, res) => {
    const sql = `
        SELECT 
            mission.id,
            mission.objet,
            mission.destination,
            mission.Date_Mission,
            mission.Frais_de_Mission,
            mission.statut_remb,
            mission.statut as mission_status,
            mission.détail_Frais,
            users.nom_et_prenom as employee,
            users.département as department
        FROM mission
        JOIN users ON mission.user_id = users.id
        WHERE mission.statut_remb = 'En attente'
        ORDER BY mission.Date_Mission DESC
    `;
    db.query(sql, (err, results) => {
        if (err) {
            console.error('[DB ERROR] fetching missions for financial:', err);
            return res.status(500).json({ error: 'Database error', details: err });
        }
        res.json(results);
    });
});

// Get complete mission history for HistoriqueComplet
server.get('/api/financial/mission-history', (req, res) => {
    const sql = `
        SELECT 
            mission.id,
            mission.objet,
            mission.destination,
            mission.Date_Mission,
            mission.Frais_de_Mission,
            mission.statut_remb,
            mission.statut as mission_status,
            mission.détail_Frais,
            users.nom_et_prenom as employee,
            users.département as department
        FROM mission
        JOIN users ON mission.user_id = users.id
        WHERE mission.statut_remb IN ('Validée', 'Refusée', 'Payé')
        ORDER BY mission.Date_Mission DESC
    `;
    
    db.query(sql, (err, results) => {
        if (err) {
            console.error('[DB ERROR] fetching mission history:', err);
            return res.status(500).json({ error: 'Database error', details: err });
        }
        
        // Process each mission to calculate grand total and difference
        const processedResults = results.map(mission => {
            let grandTotal = 0;
            let difference = 0;
            
            if (mission.détail_Frais) {
                try {
                    const details = typeof mission.détail_Frais === 'string' 
                        ? JSON.parse(mission.détail_Frais) 
                        : mission.détail_Frais;
                    
                    if (Array.isArray(details)) {
                        grandTotal = details.reduce((total, item) => {
                            return total + (
                                Number(item.montantKm || 0) + 
                                Number(item.P_D || 0) + 
                                Number(item.repas || 0) + 
                                Number(item.diner || 0) + 
                                Number(item.logement || 0) + 
                                Number(item.montantdet || 0)
                            );
                        }, 0);
                    }
                } catch (error) {
                    console.error('Error parsing détail_Frais for mission', mission.id, ':', error);
                    grandTotal = 0;
                }
            }
            
            // Calculate difference (grandTotal - advance)
            const advance = Number(mission.Frais_de_Mission || 0);
            difference = grandTotal - advance;
            
            return {
                id: mission.id,
                employee: mission.employee,
                department: mission.department,
                objet: mission.objet,
                destination: mission.destination,
                date_mission: mission.Date_Mission,
                advance: advance,
                grandTotal: grandTotal,
                difference: difference,
                statut_remb: mission.statut_remb,
                mission_status: mission.mission_status
            };
        });
        
        res.json(processedResults);
    });
});

// Update mission reimbursement status
server.put('/api/financial/update-status/:missionId', (req, res) => {
    const { missionId } = req.params;
    const { statut_remb } = req.body;
    
    // Validate input
    if (!missionId || !statut_remb) {
        return res.status(400).json({ error: 'Mission ID and status are required' });
    }
    
    // Validate status values
    const validStatuses = ['En attente', 'Validée', 'Refusée', 'Payé'];
    if (!validStatuses.includes(statut_remb)) {
        return res.status(400).json({ error: 'Invalid status value' });
    }
    
    const sql = 'UPDATE mission SET statut_remb = ? WHERE id = ?';
    
    db.query(sql, [statut_remb, missionId], (err, result) => {
        if (err) {
            console.error('[DB ERROR] updating mission status:', err);
            return res.status(500).json({ error: 'Database error', details: err });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Mission not found' });
        }
        
        res.json({ 
            success: true, 
            message: `Mission status updated to ${statut_remb}`,
            missionId: missionId,
            newStatus: statut_remb
        });
    });
});

server.listen(8010, () => {
    console.log("Listening on port 8010");
});