-- drop table user_in_escalation_level;
-- drop table schedule_in_escalation_level;
-- drop table user_in_team;
-- drop table user_manages_team;
-- drop table layer;
-- drop table schedule;
-- drop table team;
-- drop table user;
-- drop table escalation_level;
-- drop table service;

CREATE TABLE USER (
	Username		VARCHAR(25)		NOT NULL,
    Password		VARCHAR(50)		NOT NULL,
    FirstName		VARCHAR(15)		NOT NULL,
    LastName		VARCHAR(25)		NOT NULL,
    Email			VARCHAR(254),
    Phone			VARCHAR(12),
    PRIMARY KEY (Username)
);

CREATE TABLE TEAM (
	ID				INT				NOT NULL,
    Name			VARCHAR(50)		NOT NULL,
    PRIMARY KEY (ID)
);

CREATE TABLE USER_IN_TEAM (
	Username		VARCHAR(25)		NOT NULL,
	TeamID			INT				NOT NULL,
    PRIMARY KEY (Username,TeamID),
    FOREIGN KEY (Username) references USER(Username),
    FOREIGN KEY (TeamID) references TEAM(ID)
);

CREATE TABLE USER_MANAGES_TEAM (
	Username		VARCHAR(25)		NOT NULL,
	TeamID			INT				NOT NULL,
    PRIMARY KEY (Username,TeamID),
    FOREIGN KEY (Username) references USER(Username),
    FOREIGN KEY (TeamID) references TEAM(ID)
);

CREATE TABLE SCHEDULE (
	TeamID			INT				NOT NULL,
    Name			VARCHAR(50)		NOT NULL,
    PRIMARY KEY (TeamID,Name),
    FOREIGN KEY (TeamID) references TEAM(ID)
);

CREATE TABLE LAYER (
	TeamID			INT				NOT NULL,
    Name			VARCHAR(50)		NOT NULL,
	Number			INT				NOT NULL,
    PRIMARY KEY (TeamID,Name,Number),
    FOREIGN KEY (TeamID,Name) references SCHEDULE(TeamID,Name)
);

CREATE TABLE SERVICE (
	ID				INT				NOT NULL,
    Name			VARCHAR(50)		NOT NULL,
    PRIMARY KEY (ID)
);

CREATE TABLE ESCALATION_LEVEL (
	ServiceID		INT				NOT NULL,
	Level			INT				NOT NULL,
    Delay			INT				NOT NULL,
    PRIMARY KEY (ServiceID,Level),
    FOREIGN KEY (ServiceID) REFERENCES SERVICE(ID)
);

CREATE TABLE USER_IN_ESCALATION_LEVEL (
	Username		VARCHAR(25)		NOT NULL,		
	ServiceID		INT				NOT NULL,
	Level			INT				NOT NULL,
	PRIMARY KEY (Username,ServiceID,Level),
    FOREIGN KEY (Username) REFERENCES USER(Username),
    FOREIGN KEY (ServiceID,Level) REFERENCES ESCALATION_LEVEL(ServiceID,Level)
);

CREATE TABLE SCHEDULE_IN_ESCALATION_LEVEL (
	TeamID			INT				NOT NULL,
    Name			VARCHAR(50)		NOT NULL,
	ServiceID		INT				NOT NULL,
	Level			INT				NOT NULL,
	PRIMARY KEY (TeamID,Name,ServiceID,Level),
    FOREIGN KEY (TeamID,Name) REFERENCES SCHEDULE(TeamID,Name),
    FOREIGN KEY (ServiceID,Level) REFERENCES ESCALATION_LEVEL(ServiceID,Level)
);


