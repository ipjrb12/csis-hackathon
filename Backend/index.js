const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// Database setup
const db = new sqlite3.Database("./db/mydb.sqlite", (err) => {
  if (err) {
    console.error("Error opening database", err.message);
  } else {
    console.log("Connected to the SQLite database.");
    db.exec("PRAGMA foreign_keys = ON;", (error) => {
      if (error) {
        console.error("Pragma statement didn't execute successfully", error);
      } else {
        console.log("Foreign Key Enforcement is on.");
      }
    });

    db.run(
      `
            CREATE TABLE IF NOT EXISTS EVENTS (
                events_id INTEGER PRIMARY KEY,
                events_type VARCHAR(255),
                events_year INTEGER,
                events_national_international VARCHAR(255),
                events_title VARCHAR(255),
                events_from_date DATE,
                events_to_date DATE,
                events_total_participations INTEGER,
                events_total_participation_external INTEGER,
                events_web_links VARCHAR(255),
                events_fund_received_govt INTEGER,
                events_fund_received_pvt INTEGER,
                events_fund_received_bits INTEGER,
                events_fund_registration_fees INTEGER,
                events_fund_others INTEGER,
                events_organized_by VARCHAR(255),
                events_city VARCHAR(255),
                events_country VARCHAR(255)
            );
        `,
      (err) => {
        if (err) {
          console.log(err);
        }
      }
    );

    db.run(
      `
            CREATE TABLE IF NOT EXISTS EVENTS_ATTENDED (
                events_attended_id INTEGER PRIMARY KEY,
                events_attended_participant_id VARCHAR(255),
                events_attended_participant_type VARCHAR(255),
                events_attended_presentation_paper_title VARCHAR(255)
            );
        `,
      (err) => {
        if (err) {
          console.log(err);
        }
      }
    );

    db.run(
      `
    CREATE TABLE IF NOT EXISTS ACADEMIC_SERVICES (
        campus_id INTEGER PRIMARY KEY AUTOINCREMENT,
        department VARCHAR(100),
        academic_year VARCHAR(20),
        full_name_of_faculty VARCHAR(100),
        faculty_designation VARCHAR(100),
        faculty_PSRN VARCHAR(10),
        development_through VARCHAR(100),
        from_date DATE,
        to_date DATE,
        name_of_immersion_event VARCHAR(100),
        name_of_contact VARCHAR(100),
        name_of_organization_visited VARCHAR(100),
        name_of_journal VARCHAR(100),
        publishing_agency VARCHAR(100),
        name_of_government_body VARCHAR(100),
        role_membership_position TEXT,
        address_place VARCHAR(255),
        country VARCHAR(100),
        reviewer_examiner_other_description TEXT,
        organized_by VARCHAR(100)
    );
`,
      (err) => {
        if (err) {
          console.error("Error creating ACADEMIC_SERVICES table", err.message);
        } else {
          console.log("ACADEMIC_SERVICES table created successfully.");
        }
      }
    );

    db.run(`
    CREATE TABLE IF NOT EXISTS INVITED_TALKS (
        talk_id INTEGER PRIMARY KEY AUTOINCREMENT,
        campus VARCHAR(100),
        department VARCHAR(100),
        academic_year VARCHAR(20),
        title_of_talk TEXT,
        delivered_by VARCHAR(100),
        faculty_speaker_name VARCHAR(100),
        faculty_speaker_designation VARCHAR(100),
        faculty_speaker_institute_organization VARCHAR(100),
        speaker_email VARCHAR(100),
        delivered_at_event_place TEXT,
        broadcasted_online INTEGER
    );
`, (err) => {
    if (err) {
        console.error('Error creating INVITED_TALKS table', err.message);
    } else {
        console.log('INVITED_TALKS table created successfully.');
    }
});

db.run(`
    CREATE TABLE IF NOT EXISTS STUDENTS_PARTICIPATION_AWARDS (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email_address TEXT,
        academic_year TEXT,
        campus TEXT,
        department TEXT,
        month_year_of_participation_awarded TEXT,
        awarded INTEGER,
        award_type TEXT,
        name_of_award TEXT,
        name_of_conducting_agency TEXT,
        address_of_agency TEXT,
        participation_by TEXT,
        student_name TEXT,
        student_email_id TEXT,
        student_contact_number TEXT,
        bits_id_no TEXT,
        team_lead TEXT,
        web_link_of_participation_awarded TEXT
    );
`, (err) => {
    if (err) {
        console.error('Error creating STUDENTS_PARTICIPATION_AWARDS table', err.message);
    } else {
        console.log('STUDENTS_PARTICIPATION_AWARDS table created successfully.');
    }
});


  }
});

// API endpoints

// Fetch all events
app.get("/get/events", (req, res) => {
  db.all("SELECT * FROM EVENTS", [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: rows,
    });
  });
});

// Add an event
app.post("/add/events", (req, res) => {
  const data = req.body;
  const sql =
    "INSERT INTO EVENTS (events_type, events_year, events_national_international, events_title, events_from_date, events_to_date, events_total_participations, events_total_participation_external, events_web_links, events_fund_received_govt, events_fund_received_pvt, events_fund_received_bits, events_fund_registration_fees, events_fund_others, events_organized_by, events_city, events_country) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
  const params = [
    data.events_type,
    data.events_year,
    data.events_national_international,
    data.events_title,
    data.events_from_date,
    data.events_to_date,
    data.events_total_participations,
    data.events_total_participation_external,
    data.events_web_links,
    data.events_fund_received_govt,
    data.events_fund_received_pvt,
    data.events_fund_received_bits,
    data.events_fund_registration_fees,
    data.events_fund_others,
    data.events_organized_by,
    data.events_city,
    data.events_country,
  ];

  db.run(sql, params, function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: data,
      id: this.lastID,
    });
  });
});

// Fetch all events attended
app.get("/get/events-attended", (req, res) => {
  db.all("SELECT * FROM EVENTS_ATTENDED", [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: rows,
    });
  });
});

// Add an event attended
app.post("/add/events-attended", (req, res) => {
  const data = req.body;
  const sql =
    "INSERT INTO EVENTS_ATTENDED (events_attended_participant_id, events_attended_participant_type, events_attended_presentation_paper_title) VALUES (?,?,?)";
  const params = [
    data.events_attended_participant_id,
    data.events_attended_participant_type,
    data.events_attended_presentation_paper_title,
  ];

  db.run(sql, params, function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: data,
      id: this.lastID,
    });
  });
});

// Delete an event by events_id
app.delete("/delete/events/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM EVENTS WHERE events_id = ?";

  db.run(sql, id, function (err) {
    if (err) {
      res.status(400).json({ error: res.message });
      return;
    }
    res.json({ message: "deleted", rows: this.changes });
  });
});

// Delete an event attendance record by events_attended_id
app.delete("/delete/events-attended/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM EVENTS_ATTENDED WHERE events_attended_id = ?";

  db.run(sql, id, function (err) {
    if (err) {
      res.status(400).json({ error: res.message });
      return;
    }
    res.json({ message: "deleted", rows: this.changes });
  });
});

app.post('/add/academic-services', (req, res) => {
    const {
        department, academic_year, full_name_of_faculty, faculty_designation,
        faculty_PSRN, development_through, from_date, to_date,
        name_of_immersion_event, name_of_contact, name_of_organization_visited,
        name_of_journal, publishing_agency, name_of_government_body,
        role_membership_position, address_place, country,
        reviewer_examiner_other_description, organized_by
    } = req.body;

    const sql = `INSERT INTO ACADEMIC_SERVICES (
        department, academic_year, full_name_of_faculty, faculty_designation,
        faculty_PSRN, development_through, from_date, to_date,
        name_of_immersion_event, name_of_contact, name_of_organization_visited,
        name_of_journal, publishing_agency, name_of_government_body,
        role_membership_position, address_place, country,
        reviewer_examiner_other_description, organized_by
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const params = [
        department, academic_year, full_name_of_faculty, faculty_designation,
        faculty_PSRN, development_through, from_date, to_date,
        name_of_immersion_event, name_of_contact, name_of_organization_visited,
        name_of_journal, publishing_agency, name_of_government_body,
        role_membership_position, address_place, country,
        reviewer_examiner_other_description, organized_by
    ];

    db.run(sql, params, function(err) {
        if (err) {
            res.status(400).json({"error": err.message});
            return;
        }
        res.json({
            "message": "success",
            "data": req.body,
            "id": this.lastID
        });
    });
});

app.get('/get/academic-services', (req, res) => {
    db.all("SELECT * FROM ACADEMIC_SERVICES", [], (err, rows) => {
        if (err) {
            res.status(400).json({"error": err.message});
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        });
    });
});

app.delete('/delete/academic-services/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'DELETE FROM ACADEMIC_SERVICES WHERE campus_id = ?';

    db.run(sql, id, function(err) {
        if (err) {
            res.status(400).json({"error": err.message});
            return;
        }
        // this.changes returns the number of rows affected
        if (this.changes > 0) {
            res.json({"message": "deleted", "rowsAffected": this.changes});
        } else {
            res.json({"message": "not found", "rowsAffected": this.changes});
        }
    });
});


app.get('/get/invited-talks', (req, res) => {
    db.all("SELECT * FROM INVITED_TALKS", [], (err, rows) => {
        if (err) {
            res.status(400).json({"error": err.message});
            return;
        }
        const talksWithBoolean = rows.map(row => ({
            ...row,
            broadcasted_online: row.broadcasted_online === 1
        }));
        res.json({
            "message": "success",
            "data": talksWithBoolean
        });
    });
});

app.post('/add/invited-talks', (req, res) => {
    // Assume req.body contains all the necessary data
    const broadcastedOnlineInt = req.body.broadcasted_online ? 1 : 0;
    const params = [
        req.body.campus, req.body.department, req.body.academic_year, req.body.title_of_talk,
        req.body.delivered_by, req.body.faculty_speaker_name, req.body.faculty_speaker_designation,
        req.body.faculty_speaker_institute_organization, req.body.speaker_email,
        req.body.delivered_at_event_place, broadcastedOnlineInt
    ];

    db.run(`INSERT INTO INVITED_TALKS (
        campus, department, academic_year, title_of_talk,
        delivered_by, faculty_speaker_name, faculty_speaker_designation,
        faculty_speaker_institute_organization, speaker_email,
        delivered_at_event_place, broadcasted_online
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, params, function(err) {
        if (err) {
            res.status(400).json({"error": err.message});
            return;
        }
        res.json({
            "message": "success",
            "data": req.body,
            "id": this.lastID
        });
    });
});

app.delete('/delete/invited-talks/:id', (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM INVITED_TALKS WHERE talk_id = ?", id, function(err) {
        if (err) {
            res.status(400).json({"error": err.message});
            return;
        }
        res.json({"message": "deleted", "rowsAffected": this.changes});
    });
});


app.post('/add/students-participation-awards', (req, res) => {
    const { email_address, academic_year, campus, department, month_year_of_participation_awarded, awarded, award_type, name_of_award, name_of_conducting_agency, address_of_agency, participation_by, student_name, student_email_id, student_contact_number, bits_id_no, team_lead, web_link_of_participation_awarded } = req.body;
    const sql = `INSERT INTO STUDENTS_PARTICIPATION_AWARDS (email_address, academic_year, campus, department, month_year_of_participation_awarded, awarded, award_type, name_of_award, name_of_conducting_agency, address_of_agency, participation_by, student_name, student_email_id, student_contact_number, bits_id_no, team_lead, web_link_of_participation_awarded) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [email_address, academic_year, campus, department, month_year_of_participation_awarded, awarded, award_type, name_of_award, name_of_conducting_agency, address_of_agency, participation_by, student_name, student_email_id, student_contact_number, bits_id_no, team_lead, web_link_of_participation_awarded];

    db.run(sql, params, function(err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": req.body,
            "id": this.lastID
        });
    });
});

app.get('/get/students-participation-awards', (req, res) => {
    db.all("SELECT * FROM STUDENTS_PARTICIPATION_AWARDS", [], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        });
    });
});


app.delete('/delete/students-participation-awards/:id', (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM STUDENTS_PARTICIPATION_AWARDS WHERE id = ?";

    db.run(sql, id, function(err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({ "message": "deleted", "rowsAffected": this.changes });
    });
});








// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// Graceful shutdown
process.on("SIGINT", () => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Closed the database connection.");
    process.exit(0);
  });
});
