INSERT INTO USER VALUES ('sford', 'sam_is_great', 'Sam', 'Ford', 'sford3@gatech.edu', '555-555-5555');
INSERT INTO USER VALUES ('cclegg', 'chris_is_great', 'Chris', 'Clegg', 'cclegg3@gatech.edu', '555-555-5555');
INSERT INTO USER VALUES ('hkim', 'hokeun_is_great', 'Ho Keun', 'Kim', 'hkim3@gatech.edu', '555-555-5555');
INSERT INTO USER VALUES ('jparkhurst', 'joanna_is_great', 'Joanna', 'Parkhurst', 'jparkhurst3@gatech.edu', '555-555-5555');
INSERT INTO USER VALUES ('zhancock', 'zack_is_great', 'Zack', 'Hancock', 'zhancock3@gatech.edu', '555-555-5555');

INSERT INTO SERVICE (Name) VALUES ('Database');
INSERT INTO SERVICE (Name) VALUES ('UI');
INSERT INTO SERVICE (Name) VALUES ('Server');

INSERT INTO TEAM (Name) VALUES ('Database Team');
INSERT INTO TEAM (Name) VALUES ('UI Team');
INSERT INTO TEAM (Name) VALUES ('Server Team');

INSERT INTO SCHEDULE VALUES (1, 'Default');
INSERT INTO SCHEDULE VALUES (1, 'Test');
INSERT INTO SCHEDULE VALUES (2, 'Default');
INSERT INTO SCHEDULE VALUES (3, 'Default');

INSERT INTO ESCALATION_LEVEL VALUES (1,0,0);
INSERT INTO ESCALATION_LEVEL VALUES (1,1,10);
INSERT INTO USER_IN_ESCALATION_LEVEL VALUES ('sford', 1, 1);
INSERT INTO USER_IN_ESCALATION_LEVEL VALUES ('cclegg', 1, 1);
INSERT INTO USER_IN_ESCALATION_LEVEL VALUES ('hkim', 1, 0);
INSERT INTO SCHEDULE_IN_ESCALATION_LEVEL VALUES (1,'Default',1,0);

INSERT INTO ESCALATION_LEVEL VALUES (2,0,0);
INSERT INTO ESCALATION_LEVEL VALUES (2,1,20);
INSERT INTO USER_IN_ESCALATION_LEVEL VALUES ('jparkhurst', 2, 1);
INSERT INTO USER_IN_ESCALATION_LEVEL VALUES ('zhancock', 2, 0);
INSERT INTO USER_IN_ESCALATION_LEVEL VALUES ('sford', 2, 0);
INSERT INTO SCHEDULE_IN_ESCALATION_LEVEL VALUES (2,'Default',2,1);

INSERT INTO ESCALATION_LEVEL VALUES (3,0,0);
INSERT INTO USER_IN_ESCALATION_LEVEL VALUES ('jparkhurst', 3, 0);
INSERT INTO USER_IN_ESCALATION_LEVEL VALUES ('cclegg', 3, 0);
INSERT INTO USER_IN_ESCALATION_LEVEL VALUES ('hkim', 3, 0);
INSERT INTO SCHEDULE_IN_ESCALATION_LEVEL VALUES (3,'Default',3,0);

INSERT INTO PING (ServiceID, Name, Description, Status) VALUES (1,'Database is broken?', 'Database stopped functioning, I think the new tables from the most recent commit haven\'t been created and the server threw an error. Please resolve', 'Acknowledged');
INSERT INTO PING (ServiceID, Name, Description, Status) VALUES (1,'Customer data deleted', 'Client accidentally deleted all their data, requesting help with restoring backup version ASAP', 'Resolved');
INSERT INTO PING (ServiceID, Name, Description, Status) VALUES (2,'Security exploit discovered in application', 'Sensitive client info for multiple users is being sent to the front in upon login, serious security breach, must be resolved', 'Resolved');
INSERT INTO PING (ServiceID, Name, Description, Status) VALUES (3,'Client Server Failure', 'The server for Client A is experiencig consistent outages and issues for a few hours, causing problems for client.', 'Resolved');

INSERT INTO OVERRIDE_SHIFT (TeamID,ScheduleName,Timestamp,Duration,Username) VALUES (1,'Default',NOW(),60,'cclegg');
INSERT INTO MANUAL_SHIFT (TeamID,ScheduleName,Timestamp,Duration,Username,Repeated,RepeatType) VALUES (1,'Default',NOW(),180,'cclegg',true,0);
INSERT INTO ROTATION_SHIFT (TeamID,ScheduleName,Timestamp,Duration,Repeated,RepeatType) VALUES (1,'Default',NOW(),120,true,1);
INSERT INTO USER_IN_ROTATION_SHIFT (ShiftID,Username,Position) VALUES (1,'cclegg',1);
INSERT INTO USER_IN_ROTATION_SHIFT (ShiftID,Username,Position) VALUES (1,'zhancock',2);
