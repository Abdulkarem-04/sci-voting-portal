import { CohortCode, ProgramOfStudy, RosterStudent } from '../types/election';
import { isValidAiuEmail, normalizeAiuStudentId } from '../utils/imageUtils';

export type { CohortCode, ProgramOfStudy, RosterStudent };

export const C4_SENIOR_COUNT = 139;
export const ELIGIBLE_VOTER_COUNT = 407;

export const COHORT_ROSTER: Record<string, RosterStudent> = {
  "AIU21102120": {
    "studentId": "AIU21102120",
    "fullName": "Mohammed Oussama Chakeur",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU21102174": {
    "studentId": "AIU21102174",
    "fullName": "Fuad Hiybo Hussin Mohamed",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU21102400": {
    "studentId": "AIU21102400",
    "fullName": "Abdullahi Yasin Hersi",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU22102006": {
    "studentId": "AIU22102006",
    "fullName": "Firoz Hasan",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU22102008": {
    "studentId": "AIU22102008",
    "fullName": "Thierno Madiou Diallo",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU22102009": {
    "studentId": "AIU22102009",
    "fullName": "Sidy Yaya Toure",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU22102016": {
    "studentId": "AIU22102016",
    "fullName": "Amadou Oury Diallo",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU22102020": {
    "studentId": "AIU22102020",
    "fullName": "Ibrahima Kindy Diallo",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU22102022": {
    "studentId": "AIU22102022",
    "fullName": "Nouhan Doumbouya",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU22102030": {
    "studentId": "AIU22102030",
    "fullName": "Khairul Arizka Salman",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU22102031": {
    "studentId": "AIU22102031",
    "fullName": "Antoine Leno",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU22102034": {
    "studentId": "AIU22102034",
    "fullName": "Menia Mollomou",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU22102036": {
    "studentId": "AIU22102036",
    "fullName": "Asiyan Bahahkhiri",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU22102068": {
    "studentId": "AIU22102068",
    "fullName": "Mubarak Mohamed Hussein Liban",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU22102088": {
    "studentId": "AIU22102088",
    "fullName": "Muhammad Zulfan Abidin",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU22102089": {
    "studentId": "AIU22102089",
    "fullName": "Khalid Waleed Ahmed Abdullah Ghaleb",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU22102105": {
    "studentId": "AIU22102105",
    "fullName": "Osamah Hasan Mohammed Alrebaki",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU22102107": {
    "studentId": "AIU22102107",
    "fullName": "Hafizullah Mohammadi",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU22102113": {
    "studentId": "AIU22102113",
    "fullName": "Mujeeb Urahman Junbish",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU22102120": {
    "studentId": "AIU22102120",
    "fullName": "Mohanad Abdullah Sultan Salem Dalol",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU22102121": {
    "studentId": "AIU22102121",
    "fullName": "Hasibullah Naeim",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU22102124": {
    "studentId": "AIU22102124",
    "fullName": "Omer Abdelrahim Abdalla Hussein",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU22102179": {
    "studentId": "AIU22102179",
    "fullName": "Md Mahmud Zaman",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU22102181": {
    "studentId": "AIU22102181",
    "fullName": "Mostafa Anwar",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU22102182": {
    "studentId": "AIU22102182",
    "fullName": "Md Altaf Hossain Sunny",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU22102183": {
    "studentId": "AIU22102183",
    "fullName": "Maria Yaser Abdulqader Saleh",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU22102191": {
    "studentId": "AIU22102191",
    "fullName": "Karim Ismail Abdellah Mohammed",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU22102194": {
    "studentId": "AIU22102194",
    "fullName": "Abdirahman Ibrahim Osman",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU22102195": {
    "studentId": "AIU22102195",
    "fullName": "Farjana Mahajabin Shochi",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU22102199": {
    "studentId": "AIU22102199",
    "fullName": "Khadiga Abdelkarim Hamid Idris",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU22102217": {
    "studentId": "AIU22102217",
    "fullName": "Abdulkareem Salem Karama Ba Wazir",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU22102218": {
    "studentId": "AIU22102218",
    "fullName": "Mansoor Hasan Ali Shokla",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU22102225": {
    "studentId": "AIU22102225",
    "fullName": "Abdullahi Mohamed Ali",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU22102226": {
    "studentId": "AIU22102226",
    "fullName": "Abdirahman Abdillahi Nour",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU22102227": {
    "studentId": "AIU22102227",
    "fullName": "Wejdan Salih Mohamed Jeme",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU22102229": {
    "studentId": "AIU22102229",
    "fullName": "Osamah Mohammed Mohammed Al Rusabi",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU22102236": {
    "studentId": "AIU22102236",
    "fullName": "Md Mehedi Hasan",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU22102248": {
    "studentId": "AIU22102248",
    "fullName": "Muhammad Al Wafi",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU22102251": {
    "studentId": "AIU22102251",
    "fullName": "Anas Ismail Ahmed",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU22102252": {
    "studentId": "AIU22102252",
    "fullName": "Maher Abdo Mahdi Nasser Al-Galab",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU22102253": {
    "studentId": "AIU22102253",
    "fullName": "Huthayfa Abdulrauf Mohammad Derham",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU22102256": {
    "studentId": "AIU22102256",
    "fullName": "Abdalle Ahmed Hassan",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU22102258": {
    "studentId": "AIU22102258",
    "fullName": "Rabiul Islam",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU22102263": {
    "studentId": "AIU22102263",
    "fullName": "Abdulrahman Omar Abobakr Al Amodi",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU22102265": {
    "studentId": "AIU22102265",
    "fullName": "Ibrahim Osman Sheikh Hussein",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU22102272": {
    "studentId": "AIU22102272",
    "fullName": "Mustafa Yahya",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU22102274": {
    "studentId": "AIU22102274",
    "fullName": "Ali Ali Al Saghir Ali Al Ghozi",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU22102275": {
    "studentId": "AIU22102275",
    "fullName": "M Arif Ardelian",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU22102277": {
    "studentId": "AIU22102277",
    "fullName": "Ameer Khan Wadan",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU22102278": {
    "studentId": "AIU22102278",
    "fullName": "Mohammed Hamood Abkar Al Ahdal",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU22102280": {
    "studentId": "AIU22102280",
    "fullName": "Nardi",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU22102281": {
    "studentId": "AIU22102281",
    "fullName": "Reem Bekdash",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU22102293": {
    "studentId": "AIU22102293",
    "fullName": "Osama Mohammed Saeed Ahmed Al Hasani",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU22102294": {
    "studentId": "AIU22102294",
    "fullName": "Hashem Dhaif Allah Rafiq Mwanis",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU22102296": {
    "studentId": "AIU22102296",
    "fullName": "Altagi Abdallah Bakheit Abdelgadir",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU22102301": {
    "studentId": "AIU22102301",
    "fullName": "Amr Mohammed Abduljalil Al Shameeri",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU22102303": {
    "studentId": "AIU22102303",
    "fullName": "Abdulmajeed Abdullah Ahmed Mith Al Ashwal",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU22102305": {
    "studentId": "AIU22102305",
    "fullName": "Faisal Rafat Faisal Khrisan",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU22102311": {
    "studentId": "AIU22102311",
    "fullName": "Fawad Arabzada",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU22102314": {
    "studentId": "AIU22102314",
    "fullName": "Omid Qazikhil",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU22102315": {
    "studentId": "AIU22102315",
    "fullName": "Aria Firmansyah",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU22102319": {
    "studentId": "AIU22102319",
    "fullName": "Bashar Ibrahem Ahmed Hagag",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU22102338": {
    "studentId": "AIU22102338",
    "fullName": "Hassan Abdi Dualeh",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU22102342": {
    "studentId": "AIU22102342",
    "fullName": "Mohamed Abdullahi Ali",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU22102343": {
    "studentId": "AIU22102343",
    "fullName": "Almonzer Hamid Sarray Abdallah",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU22102344": {
    "studentId": "AIU22102344",
    "fullName": "Mohammed Dahl Musawa Moota",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU22102346": {
    "studentId": "AIU22102346",
    "fullName": "Amro Khaled Mohammed Hasan Shiek",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU22102352": {
    "studentId": "AIU22102352",
    "fullName": "Samia Hassan Haron Hamid",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU22102354": {
    "studentId": "AIU22102354",
    "fullName": "S Moh Rahim Shah Shah",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU22102357": {
    "studentId": "AIU22102357",
    "fullName": "Hanaa Altaha",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU22102358": {
    "studentId": "AIU22102358",
    "fullName": "Yusuf Nuru Yesuf",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU22102359": {
    "studentId": "AIU22102359",
    "fullName": "Baraa Eltayeb Adam Hassan",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU22102362": {
    "studentId": "AIU22102362",
    "fullName": "Safiullah Yousufzai",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU22102365": {
    "studentId": "AIU22102365",
    "fullName": "Abdalhafeedh Omer Idriss Ahmed",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU22102368": {
    "studentId": "AIU22102368",
    "fullName": "Xaypanya Ngaophasy",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU22102369": {
    "studentId": "AIU22102369",
    "fullName": "Mashal Mangal",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU22102370": {
    "studentId": "AIU22102370",
    "fullName": "Ali Sena Danishwer",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU22102371": {
    "studentId": "AIU22102371",
    "fullName": "Abdurrahman Mahboob",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU23032007": {
    "studentId": "AIU23032007",
    "fullName": "Habiba Hassan Nur Hassan",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU23102007": {
    "studentId": "AIU23102007",
    "fullName": "Adam Iskandar Bin Suzalie",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU23102017": {
    "studentId": "AIU23102017",
    "fullName": "Auni Syafiah Binti Sukimi",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU23102027": {
    "studentId": "AIU23102027",
    "fullName": "Muhammad Amirul Mustaqin Bin Abdul Mutalib",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU23102031": {
    "studentId": "AIU23102031",
    "fullName": "Abdul Rahman Bin Mohd Kamal",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU23102045": {
    "studentId": "AIU23102045",
    "fullName": "Muhib Nabil Ali Mohsen",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU23102046": {
    "studentId": "AIU23102046",
    "fullName": "Alazab Mohammed Khaled Hamood",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU23102047": {
    "studentId": "AIU23102047",
    "fullName": "Musa J. Camara",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU23102053": {
    "studentId": "AIU23102053",
    "fullName": "Alihabib Hussein",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU23102057": {
    "studentId": "AIU23102057",
    "fullName": "Leroy Nyasha Mangwarara",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU23102062": {
    "studentId": "AIU23102062",
    "fullName": "Arsikin Samaeng",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU23102068": {
    "studentId": "AIU23102068",
    "fullName": "Abu Hossain",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU23102071": {
    "studentId": "AIU23102071",
    "fullName": "Md Rashidul Islam",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU23102076": {
    "studentId": "AIU23102076",
    "fullName": "Anas Sani Lawal Muhammed",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU23102077": {
    "studentId": "AIU23102077",
    "fullName": "Tadiwanashe Magara",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU23102078": {
    "studentId": "AIU23102078",
    "fullName": "Kadijatu Mansaray",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU23102084": {
    "studentId": "AIU23102084",
    "fullName": "Zikrullah Faizan",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU23102085": {
    "studentId": "AIU23102085",
    "fullName": "Sabahudin Shinwari",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU23102086": {
    "studentId": "AIU23102086",
    "fullName": "Mohammad Amin Raeed",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU23102087": {
    "studentId": "AIU23102087",
    "fullName": "Mohammad Qais Zakokhil",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU23102092": {
    "studentId": "AIU23102092",
    "fullName": "Abdullah Hakeem Mohamad",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU23102094": {
    "studentId": "AIU23102094",
    "fullName": "Gassim Kante",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU23102095": {
    "studentId": "AIU23102095",
    "fullName": "Fathima Zuha Mohamed Shafeer",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU23102097": {
    "studentId": "AIU23102097",
    "fullName": "Zin May Oo",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU23102098": {
    "studentId": "AIU23102098",
    "fullName": "Mahmadrajab Saidzoda",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU23102100": {
    "studentId": "AIU23102100",
    "fullName": "Mohemedh Sharaf Sahir",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU23102101": {
    "studentId": "AIU23102101",
    "fullName": "Naing Naing",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU23102103": {
    "studentId": "AIU23102103",
    "fullName": "Myat Min Khant",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU23102104": {
    "studentId": "AIU23102104",
    "fullName": "Moe Arkar Zaw",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU23102105": {
    "studentId": "AIU23102105",
    "fullName": "Kyi Nuu Phyu Sin",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU23102106": {
    "studentId": "AIU23102106",
    "fullName": "Hsu Myint Myat Kyaw",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU23102107": {
    "studentId": "AIU23102107",
    "fullName": "Nang Khin Myat Lay Phyu",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU23102108": {
    "studentId": "AIU23102108",
    "fullName": "Latt Yamin Htut",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU23102113": {
    "studentId": "AIU23102113",
    "fullName": "Mohamed Ansaff Abdul Salam",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU23102114": {
    "studentId": "AIU23102114",
    "fullName": "Fathima Mahmoodha Abdul Majeed",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU23102118": {
    "studentId": "AIU23102118",
    "fullName": "Maria Iqbal",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU23102121": {
    "studentId": "AIU23102121",
    "fullName": "Orzu Mirzovalizoda",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU23102124": {
    "studentId": "AIU23102124",
    "fullName": "Hnin Eaindra Htun",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU23102126": {
    "studentId": "AIU23102126",
    "fullName": "Mohamed Afrath Mohamed Naseer",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU23102127": {
    "studentId": "AIU23102127",
    "fullName": "Su Waddy Tun",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU23102132": {
    "studentId": "AIU23102132",
    "fullName": "Ye Min Myat",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU23102134": {
    "studentId": "AIU23102134",
    "fullName": "Ro Min Swe",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU23102136": {
    "studentId": "AIU23102136",
    "fullName": "Shokhjakhon Shermatov",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU23102140": {
    "studentId": "AIU23102140",
    "fullName": "Zayar Linn",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU23102141": {
    "studentId": "AIU23102141",
    "fullName": "Mohamed Nawran Nasar Mohamed",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU23102143": {
    "studentId": "AIU23102143",
    "fullName": "Anshath Ahamed Ajumil",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU23102145": {
    "studentId": "AIU23102145",
    "fullName": "May Mon Ko",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU23102149": {
    "studentId": "AIU23102149",
    "fullName": "Noorul Hasiba Abdul Hai",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU23102158": {
    "studentId": "AIU23102158",
    "fullName": "Md Shakib Mostafa",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU23102163": {
    "studentId": "AIU23102163",
    "fullName": "Nur Ezy Fathia Binti Edy Safaris",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU23102178": {
    "studentId": "AIU23102178",
    "fullName": "Shifa Adel Ali Al-Nakhlani",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU23102185": {
    "studentId": "AIU23102185",
    "fullName": "Ridwan Afolabi Muhammad",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU23102189": {
    "studentId": "AIU23102189",
    "fullName": "Tahir Ibrahim Tijjani",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU23102192": {
    "studentId": "AIU23102192",
    "fullName": "Munirah Binti Rozali",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU23102195": {
    "studentId": "AIU23102195",
    "fullName": "Fauziyya Abdullahi Ahmed",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU23102201": {
    "studentId": "AIU23102201",
    "fullName": "Eylaf Mahdi Adam Saad Elnour",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU23102206": {
    "studentId": "AIU23102206",
    "fullName": "Faruk Dagawa Umar",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU23102211": {
    "studentId": "AIU23102211",
    "fullName": "Aminu Tukur",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU23102212": {
    "studentId": "AIU23102212",
    "fullName": "Khadija Nasiru",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU23102213": {
    "studentId": "AIU23102213",
    "fullName": "Hadiza Maishanu Mustapha",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU23102214": {
    "studentId": "AIU23102214",
    "fullName": "Saminu Aminu",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU23102220": {
    "studentId": "AIU23102220",
    "fullName": "Sadiq Torankawa Malami",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU23102221": {
    "studentId": "AIU23102221",
    "fullName": "Umar Faruk M Bello",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU23102224": {
    "studentId": "AIU23102224",
    "fullName": "Abdullayee M F Donzo",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU23102228": {
    "studentId": "AIU23102228",
    "fullName": "Bakary Gibba",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU23102229": {
    "studentId": "AIU23102229",
    "fullName": "Modou Lamin Kinteh",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU23102231": {
    "studentId": "AIU23102231",
    "fullName": "Md Hasib Ul Haider",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU23102243": {
    "studentId": "AIU23102243",
    "fullName": "Abubakar Kabir Muhammad",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU23102247": {
    "studentId": "AIU23102247",
    "fullName": "Mohammed Abdulsattar Mohammedali Yousif",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Data Science (Honours)"
  },
  "AIU23102258": {
    "studentId": "AIU23102258",
    "fullName": "Nour Aldeen Mustafa",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU23102260": {
    "studentId": "AIU23102260",
    "fullName": "Zakaria Adam Ishag Abakar",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU23102267": {
    "studentId": "AIU23102267",
    "fullName": "Ahmad Abror Paut Ragajati",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU23102276": {
    "studentId": "AIU23102276",
    "fullName": "Nunung Wardani",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU23102284": {
    "studentId": "AIU23102284",
    "fullName": "Adinda Gama Sholeha",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU23102294": {
    "studentId": "AIU23102294",
    "fullName": "Mohamed Omar Hassan",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU23102295": {
    "studentId": "AIU23102295",
    "fullName": "Abdalle Yusuf Warsame",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU23102297": {
    "studentId": "AIU23102297",
    "fullName": "Mahmuda Akter",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU23102301": {
    "studentId": "AIU23102301",
    "fullName": "Md Parvej Ahmed Rafi",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU23102302": {
    "studentId": "AIU23102302",
    "fullName": "Mohammad Saiful Islam",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU23102304": {
    "studentId": "AIU23102304",
    "fullName": "Md Maruf Hasan Hridoy",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU23102314": {
    "studentId": "AIU23102314",
    "fullName": "Anwar Mohammed Koji",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU23102321": {
    "studentId": "AIU23102321",
    "fullName": "Mohammad Shaheen",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU23102324": {
    "studentId": "AIU23102324",
    "fullName": "Alpha Ibrahima Yinguissa Barry",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU23102330": {
    "studentId": "AIU23102330",
    "fullName": "Zainab Muhammad Adam",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU23102338": {
    "studentId": "AIU23102338",
    "fullName": "Rim Hasan Qaid Al-Morhi",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU23102339": {
    "studentId": "AIU23102339",
    "fullName": "Marzia Mohammadi",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU23102340": {
    "studentId": "AIU23102340",
    "fullName": "Maria Saibaa",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU23102341": {
    "studentId": "AIU23102341",
    "fullName": "Bilal Abubakar",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Information Technology (Cybersecurity) (Honours)"
  },
  "AIU23102343": {
    "studentId": "AIU23102343",
    "fullName": "Aisha Yahaya Abdulkadir",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Information Technology (Cybersecurity) (Honours)"
  },
  "AIU23102344": {
    "studentId": "AIU23102344",
    "fullName": "Raihanah Senan Qaid Ali Al-Garadi",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU23102351": {
    "studentId": "AIU23102351",
    "fullName": "Magd S.S. Alqrinawi",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24032003": {
    "studentId": "AIU24032003",
    "fullName": "Thet Hnin Eain",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Data Science (Honours)"
  },
  "AIU24032004": {
    "studentId": "AIU24032004",
    "fullName": "Ramil Chuponov",
    "cohort": "C4",
    "yearOfStudy": 3,
    "program": "Bachelor in Data Science (Honours)"
  },
  "AIU24102001": {
    "studentId": "AIU24102001",
    "fullName": "Sajed I.F Abushawish",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Data Science (Honours)"
  },
  "AIU24102002": {
    "studentId": "AIU24102002",
    "fullName": "Adnan A. S. Abushalhoub",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102003": {
    "studentId": "AIU24102003",
    "fullName": "Rami K. H. Naser",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102024": {
    "studentId": "AIU24102024",
    "fullName": "Nurhaniza Binti Ahmad",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102030": {
    "studentId": "AIU24102030",
    "fullName": "Mohamed Khalid Mohamedahmed",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102033": {
    "studentId": "AIU24102033",
    "fullName": "Ab Dulloh Nor",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102034": {
    "studentId": "AIU24102034",
    "fullName": "Mu Ham Mad Sa Phi Y",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102037": {
    "studentId": "AIU24102037",
    "fullName": "Alqawsi Khalid Naji Mohammed Naji",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102041": {
    "studentId": "AIU24102041",
    "fullName": "Mohammad Elyas Yameen",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102046": {
    "studentId": "AIU24102046",
    "fullName": "Muwafak Abubakar",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102052": {
    "studentId": "AIU24102052",
    "fullName": "Daniel Abdouroihamane Ibrahim Mhadji",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102053": {
    "studentId": "AIU24102053",
    "fullName": "Salaheldeen Ahmed Mohamed Eilaf",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102056": {
    "studentId": "AIU24102056",
    "fullName": "Mahian Ibne Ferdous",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102058": {
    "studentId": "AIU24102058",
    "fullName": "Jahid Hassan Noor",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102068": {
    "studentId": "AIU24102068",
    "fullName": "Kedir Jabir Saliya",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102071": {
    "studentId": "AIU24102071",
    "fullName": "Eshraga Adil Yousif Alsmani",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102074": {
    "studentId": "AIU24102074",
    "fullName": "Abdulrahman Ahmed Qasem Ali Mahdi",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102075": {
    "studentId": "AIU24102075",
    "fullName": "Ahmed Abdullah Ibrahim Abdullah Al-Aqel",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102076": {
    "studentId": "AIU24102076",
    "fullName": "Muhammad Hasnat Anwar",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102077": {
    "studentId": "AIU24102077",
    "fullName": "Mohammed Hussein Meqdam Hasan Meqdam",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102081": {
    "studentId": "AIU24102081",
    "fullName": "Aya Tarig Salaheldein Bashir",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102082": {
    "studentId": "AIU24102082",
    "fullName": "Hanifa Yousufi",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102085": {
    "studentId": "AIU24102085",
    "fullName": "Seeta Hakimzada",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102090": {
    "studentId": "AIU24102090",
    "fullName": "Sadia Afrin Samia",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102091": {
    "studentId": "AIU24102091",
    "fullName": "Khalil Ur Rehman Saeed",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102093": {
    "studentId": "AIU24102093",
    "fullName": "Khatera Rezaie",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102096": {
    "studentId": "AIU24102096",
    "fullName": "Abdulbari Ahmed Gamil Abdulmomen",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102097": {
    "studentId": "AIU24102097",
    "fullName": "Elias Nashwan Mohammed Al-Sumairi",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102102": {
    "studentId": "AIU24102102",
    "fullName": "Hasnain Haider",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102105": {
    "studentId": "AIU24102105",
    "fullName": "Wazhma Maroof",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102106": {
    "studentId": "AIU24102106",
    "fullName": "Waseem Mushtaq",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102107": {
    "studentId": "AIU24102107",
    "fullName": "Ka Ri Mah Sa Id",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102112": {
    "studentId": "AIU24102112",
    "fullName": "Mowlid Mohamoud Haibe",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102115": {
    "studentId": "AIU24102115",
    "fullName": "Mahboobullah Rasuli",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102126": {
    "studentId": "AIU24102126",
    "fullName": "Behishta Qaderi",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102127": {
    "studentId": "AIU24102127",
    "fullName": "Salma Putri Insani",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102128": {
    "studentId": "AIU24102128",
    "fullName": "Mahamoud Ahmed Mahamoud",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102129": {
    "studentId": "AIU24102129",
    "fullName": "Md Hasibur Rahman",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102130": {
    "studentId": "AIU24102130",
    "fullName": "Asif Ahmed",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102132": {
    "studentId": "AIU24102132",
    "fullName": "Md Ismayel",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102152": {
    "studentId": "AIU24102152",
    "fullName": "Liyana Afifah Binti Amirudin",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102153": {
    "studentId": "AIU24102153",
    "fullName": "Syed Aliff Hilmi Bin Syed Abd Khadir",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102154": {
    "studentId": "AIU24102154",
    "fullName": "Imman Nurbalqish Nabilah Binti Suhaimi",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102155": {
    "studentId": "AIU24102155",
    "fullName": "Nurul Rahimah Binti Ahmad Subri",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102156": {
    "studentId": "AIU24102156",
    "fullName": "Nur Khairunnisa Binti Ramli",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Data Science (Honours)"
  },
  "AIU24102157": {
    "studentId": "AIU24102157",
    "fullName": "Ahmad Faiz Najmi Bin Muhammad Azmi",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Data Science (Honours)"
  },
  "AIU24102176": {
    "studentId": "AIU24102176",
    "fullName": "May Mon Ko Ko",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102177": {
    "studentId": "AIU24102177",
    "fullName": "Musab Ahamed Iqram",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102178": {
    "studentId": "AIU24102178",
    "fullName": "May Myat Noe Lwin",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102179": {
    "studentId": "AIU24102179",
    "fullName": "Hnin Shwe Yee Htun",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Data Science (Honours)"
  },
  "AIU24102180": {
    "studentId": "AIU24102180",
    "fullName": "Chit Ko Ko",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102181": {
    "studentId": "AIU24102181",
    "fullName": "Mohammad Hafil Mohamed Haniffa",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102182": {
    "studentId": "AIU24102182",
    "fullName": "Htet Htet Nweni Kyaw",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102183": {
    "studentId": "AIU24102183",
    "fullName": "Imanathul Reyyan Mohammad Munas",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102184": {
    "studentId": "AIU24102184",
    "fullName": "Min Khant Maung",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102185": {
    "studentId": "AIU24102185",
    "fullName": "Moe Thuzar Win",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Data Science (Honours)"
  },
  "AIU24102186": {
    "studentId": "AIU24102186",
    "fullName": "Muiz Tanibekov",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102187": {
    "studentId": "AIU24102187",
    "fullName": "Khin Pwint Yati Maung",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102188": {
    "studentId": "AIU24102188",
    "fullName": "Soe Sandi Aung",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102189": {
    "studentId": "AIU24102189",
    "fullName": "Thone Dra",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102190": {
    "studentId": "AIU24102190",
    "fullName": "Kyaw Zin Win",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102191": {
    "studentId": "AIU24102191",
    "fullName": "Lay Pyay Hnin",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102192": {
    "studentId": "AIU24102192",
    "fullName": "Maryam Hussaina Muhammad Rafeek",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102193": {
    "studentId": "AIU24102193",
    "fullName": "Moe Myint May",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102194": {
    "studentId": "AIU24102194",
    "fullName": "Nay Paing Oo",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102195": {
    "studentId": "AIU24102195",
    "fullName": "Abdullah Safras Ahamed",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102196": {
    "studentId": "AIU24102196",
    "fullName": "Win Yan Naing Htut",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102197": {
    "studentId": "AIU24102197",
    "fullName": "Aung Zay Yan Phyo",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102198": {
    "studentId": "AIU24102198",
    "fullName": "Fathima Wazna Mohamed Sarafathulla",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102199": {
    "studentId": "AIU24102199",
    "fullName": "Mohamed Hamdan Ameer Irshad",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Data Science (Honours)"
  },
  "AIU24102200": {
    "studentId": "AIU24102200",
    "fullName": "Thet Myat Noe",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102201": {
    "studentId": "AIU24102201",
    "fullName": "Mohamed Shohan Saleem",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Data Science (Honours)"
  },
  "AIU24102202": {
    "studentId": "AIU24102202",
    "fullName": "Aye Sandi Myint",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102203": {
    "studentId": "AIU24102203",
    "fullName": "Khin Yadanar Phyo",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Data Science (Honours)"
  },
  "AIU24102204": {
    "studentId": "AIU24102204",
    "fullName": "Mohamad Ammar Mohamad Hassan",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Data Science (Honours)"
  },
  "AIU24102231": {
    "studentId": "AIU24102231",
    "fullName": "Mohammed Khaled Abdo Ahmed",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102232": {
    "studentId": "AIU24102232",
    "fullName": "Mohammad Hossain",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102244": {
    "studentId": "AIU24102244",
    "fullName": "Reza Farhan Menezes Aljidis",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102258": {
    "studentId": "AIU24102258",
    "fullName": "Salma Adnan Sultan Al-Amodi",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102259": {
    "studentId": "AIU24102259",
    "fullName": "Ishmam Siddique",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102263": {
    "studentId": "AIU24102263",
    "fullName": "Ehsanul Hoque",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102264": {
    "studentId": "AIU24102264",
    "fullName": "Hammad Hassan",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102265": {
    "studentId": "AIU24102265",
    "fullName": "Sankumba Balajo",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102271": {
    "studentId": "AIU24102271",
    "fullName": "Abdou Salam Sisawo",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102280": {
    "studentId": "AIU24102280",
    "fullName": "Maralbyek Tilyek",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102291": {
    "studentId": "AIU24102291",
    "fullName": "Tusneem Apichai",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102294": {
    "studentId": "AIU24102294",
    "fullName": "Yalda Ashrafi",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102297": {
    "studentId": "AIU24102297",
    "fullName": "Musa Turai Adam",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102306": {
    "studentId": "AIU24102306",
    "fullName": "Afifah Binti Mohd Shukri",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Data Science (Honours)"
  },
  "AIU24102307": {
    "studentId": "AIU24102307",
    "fullName": "Faryaan Khan Boodhoo",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102310": {
    "studentId": "AIU24102310",
    "fullName": "Homaira Mohammadi",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102319": {
    "studentId": "AIU24102319",
    "fullName": "Ummasalma Jamil",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Data Science (Honours)"
  },
  "AIU24102320": {
    "studentId": "AIU24102320",
    "fullName": "Gafar Aamir Mukhtar Alnour",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102323": {
    "studentId": "AIU24102323",
    "fullName": "Abdulkarem Ajogal Abubakar",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102333": {
    "studentId": "AIU24102333",
    "fullName": "Usman Anyalo Usman",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102340": {
    "studentId": "AIU24102340",
    "fullName": "Anopa Machipisa",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102344": {
    "studentId": "AIU24102344",
    "fullName": "Wolanga Jalalzai",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102345": {
    "studentId": "AIU24102345",
    "fullName": "Sara Rasoli",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102348": {
    "studentId": "AIU24102348",
    "fullName": "Harish Ramalingam",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Data Science (Honours)"
  },
  "AIU24102353": {
    "studentId": "AIU24102353",
    "fullName": "Khandakar Jahanjeb Faheem",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102358": {
    "studentId": "AIU24102358",
    "fullName": "Nadim Hossain",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102359": {
    "studentId": "AIU24102359",
    "fullName": "Nasif Monwor",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102366": {
    "studentId": "AIU24102366",
    "fullName": "Mariame Diare",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102370": {
    "studentId": "AIU24102370",
    "fullName": "Khalid Abdussamii",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102371": {
    "studentId": "AIU24102371",
    "fullName": "Oloyede Hussein Oluwasegun",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102372": {
    "studentId": "AIU24102372",
    "fullName": "Alli Barakat Bukola",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102375": {
    "studentId": "AIU24102375",
    "fullName": "Abdalfatah S. A. Salhab",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102378": {
    "studentId": "AIU24102378",
    "fullName": "Sebire Hakyar",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102383": {
    "studentId": "AIU24102383",
    "fullName": "Bonson Adem Alo",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102388": {
    "studentId": "AIU24102388",
    "fullName": "Freshta Ebrahimi",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102392": {
    "studentId": "AIU24102392",
    "fullName": "Shee Rashid Dina",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102393": {
    "studentId": "AIU24102393",
    "fullName": "Fatimah Aynal",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Data Science (Honours)"
  },
  "AIU24102394": {
    "studentId": "AIU24102394",
    "fullName": "Kabisha Hafizi",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102398": {
    "studentId": "AIU24102398",
    "fullName": "S M Nadim Mahmud",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102399": {
    "studentId": "AIU24102399",
    "fullName": "Nasif Mahmud Nafi",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102400": {
    "studentId": "AIU24102400",
    "fullName": "Sifat Ullah",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102401": {
    "studentId": "AIU24102401",
    "fullName": "Munawa Abudujilili",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102402": {
    "studentId": "AIU24102402",
    "fullName": "Abdinasir Mustafe Muhumed",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102416": {
    "studentId": "AIU24102416",
    "fullName": "Naysheila Nadya Shofwa",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102427": {
    "studentId": "AIU24102427",
    "fullName": "Zarghoona Mirzaee",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102433": {
    "studentId": "AIU24102433",
    "fullName": "Near Steve Chabe",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102434": {
    "studentId": "AIU24102434",
    "fullName": "Mohammed Saad Salih Abdalla",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102441": {
    "studentId": "AIU24102441",
    "fullName": "Md Towhidul Islam Tamim Mia",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102442": {
    "studentId": "AIU24102442",
    "fullName": "Md Ariful Islam",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102453": {
    "studentId": "AIU24102453",
    "fullName": "Abdulaziz Taju Mohammedyasin",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102454": {
    "studentId": "AIU24102454",
    "fullName": "Amir Wuhab Nurhussen",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102456": {
    "studentId": "AIU24102456",
    "fullName": "Benat Siraj Ahmed",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102457": {
    "studentId": "AIU24102457",
    "fullName": "Elham Ahmedngus Husen",
    "cohort": "C5",
    "yearOfStudy": 3,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102460": {
    "studentId": "AIU24102460",
    "fullName": "Zaid Alfalah",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102463": {
    "studentId": "AIU24102463",
    "fullName": "Sima Gulestani",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU24102464": {
    "studentId": "AIU24102464",
    "fullName": "Obai Osama Mubarak Abdelsalam Shaaban",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Data Science (Honours)"
  },
  "AIU25102012": {
    "studentId": "AIU25102012",
    "fullName": "Amatullah Ali",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102013": {
    "studentId": "AIU25102013",
    "fullName": "Hawa Abdul-Salam",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102014": {
    "studentId": "AIU25102014",
    "fullName": "Naeem Abbas",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102015": {
    "studentId": "AIU25102015",
    "fullName": "Ali Ibtisam",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Data Science (Honours)"
  },
  "AIU25102022": {
    "studentId": "AIU25102022",
    "fullName": "Nadia H. H. Aldaghma",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102025": {
    "studentId": "AIU25102025",
    "fullName": "Modou Lamin Sanno",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102026": {
    "studentId": "AIU25102026",
    "fullName": "Omar Shawqi Abdo Alzaghir",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102031": {
    "studentId": "AIU25102031",
    "fullName": "Hamed Khaled Qasem Al-Nusairi",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102037": {
    "studentId": "AIU25102037",
    "fullName": "Soraya Nazari",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102043": {
    "studentId": "AIU25102043",
    "fullName": "Milad Sahebi",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102048": {
    "studentId": "AIU25102048",
    "fullName": "Abeddin Mosawi",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102055": {
    "studentId": "AIU25102055",
    "fullName": "Siti Nur Syafiqah Binti Mohamad Nasir",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Data Science (Honours)"
  },
  "AIU25102059": {
    "studentId": "AIU25102059",
    "fullName": "Nurul Atirah Binti Zulkifli",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102069": {
    "studentId": "AIU25102069",
    "fullName": "Amier Ashraff Bin Baharudin",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102082": {
    "studentId": "AIU25102082",
    "fullName": "Hanifa Aiyob",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102085": {
    "studentId": "AIU25102085",
    "fullName": "Hamidy Ali",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102087": {
    "studentId": "AIU25102087",
    "fullName": "Abdillahi Abdi Aabi",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102089": {
    "studentId": "AIU25102089",
    "fullName": "Md Isratul",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102090": {
    "studentId": "AIU25102090",
    "fullName": "Jahidul Islam Rabbany",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102091": {
    "studentId": "AIU25102091",
    "fullName": "Md Shafie Mondol",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102097": {
    "studentId": "AIU25102097",
    "fullName": "Yahaya Abdullahi",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102100": {
    "studentId": "AIU25102100",
    "fullName": "Md Yusha Bin Nur",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102102": {
    "studentId": "AIU25102102",
    "fullName": "Tanha Beentey Ali",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102103": {
    "studentId": "AIU25102103",
    "fullName": "Hafeeza Shakila",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102104": {
    "studentId": "AIU25102104",
    "fullName": "Faria Islam Farjana",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102105": {
    "studentId": "AIU25102105",
    "fullName": "Samia Farhin",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102106": {
    "studentId": "AIU25102106",
    "fullName": "Shawwal Afridi Adib",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Data Science (Honours)"
  },
  "AIU25102110": {
    "studentId": "AIU25102110",
    "fullName": "Mustapha Gaye",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102111": {
    "studentId": "AIU25102111",
    "fullName": "Bakary Keita",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102113": {
    "studentId": "AIU25102113",
    "fullName": "Monira Muneer Mohamed Satti",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Data Science (Honours)"
  },
  "AIU25102115": {
    "studentId": "AIU25102115",
    "fullName": "Ali Abdulhamid Ambwa",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102120": {
    "studentId": "AIU25102120",
    "fullName": "Ousman Z Trawally",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102138": {
    "studentId": "AIU25102138",
    "fullName": "Passion Tawananyasha Manyota",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102139": {
    "studentId": "AIU25102139",
    "fullName": "Bernard Muzenda",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102144": {
    "studentId": "AIU25102144",
    "fullName": "Neo Dalubuhle Gugu Mlilo",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102148": {
    "studentId": "AIU25102148",
    "fullName": "Abdulmajeed Salmen Yaslam Matamat",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102149": {
    "studentId": "AIU25102149",
    "fullName": "Feysel Anwar Surur",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102154": {
    "studentId": "AIU25102154",
    "fullName": "Omid Ahmad Baha",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102157": {
    "studentId": "AIU25102157",
    "fullName": "Nur Jumairah Binti Shaffri",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Data Science (Honours)"
  },
  "AIU25102161": {
    "studentId": "AIU25102161",
    "fullName": "Muhammad Hafiz Bin Othman",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102162": {
    "studentId": "AIU25102162",
    "fullName": "Ijazurrahim Bin Ahmad Faizal",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102163": {
    "studentId": "AIU25102163",
    "fullName": "Muhammad Alif Fahmi Bin Muhamad Azahari",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102207": {
    "studentId": "AIU25102207",
    "fullName": "Ismail Hosen",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Data Science (Honours)"
  },
  "AIU25102210": {
    "studentId": "AIU25102210",
    "fullName": "Phyo Wai Aung",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Data Science (Honours)"
  },
  "AIU25102211": {
    "studentId": "AIU25102211",
    "fullName": "Thahida Mohd Noor",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Data Science (Honours)"
  },
  "AIU25102212": {
    "studentId": "AIU25102212",
    "fullName": "Aung Kaung Myat",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102213": {
    "studentId": "AIU25102213",
    "fullName": "Myo San",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102214": {
    "studentId": "AIU25102214",
    "fullName": "Paing Zayar Tun",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102215": {
    "studentId": "AIU25102215",
    "fullName": "Phyo Naing Oo",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102216": {
    "studentId": "AIU25102216",
    "fullName": "Yee Mon Lwin",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102230": {
    "studentId": "AIU25102230",
    "fullName": "Hamdha Banu Ainudeen Hasiyar",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Data Science (Honours)"
  },
  "AIU25102231": {
    "studentId": "AIU25102231",
    "fullName": "Mohamed Anshaf Anver Hassan",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Data Science (Honours)"
  },
  "AIU25102232": {
    "studentId": "AIU25102232",
    "fullName": "Mohamed Armash Mohamed Rifkan",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Data Science (Honours)"
  },
  "AIU25102233": {
    "studentId": "AIU25102233",
    "fullName": "Muhammad Zaafir Nisthar",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Data Science (Honours)"
  },
  "AIU25102234": {
    "studentId": "AIU25102234",
    "fullName": "Samith Mishal Althaf Aasif",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Data Science (Honours)"
  },
  "AIU25102235": {
    "studentId": "AIU25102235",
    "fullName": "Alham Ameerul Azhar",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102236": {
    "studentId": "AIU25102236",
    "fullName": "Muhamed Ayaan Anver Sadath",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102237": {
    "studentId": "AIU25102237",
    "fullName": "Fathima Muzna Murshid Ahamed",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102238": {
    "studentId": "AIU25102238",
    "fullName": "Ilma Mohammadhu Azhar",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102239": {
    "studentId": "AIU25102239",
    "fullName": "Pathima Nadha Mohamad Naupi",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102240": {
    "studentId": "AIU25102240",
    "fullName": "Zakira Gazzali",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102241": {
    "studentId": "AIU25102241",
    "fullName": "Zeenath Safra Mohamed Zahim",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102242": {
    "studentId": "AIU25102242",
    "fullName": "Mohammed Aqeel Mohammed Maseeroor",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102263": {
    "studentId": "AIU25102263",
    "fullName": "Abidat Omobolanle Saleeman",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Data Science (Honours)"
  },
  "AIU25102265": {
    "studentId": "AIU25102265",
    "fullName": "Habeebat Temilade Raji",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Data Science (Honours)"
  },
  "AIU25102269": {
    "studentId": "AIU25102269",
    "fullName": "Maram Abdulmajeed Abduljalil Al-Qadhi",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102274": {
    "studentId": "AIU25102274",
    "fullName": "MD. Junayed Hossain Ratul",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102275": {
    "studentId": "AIU25102275",
    "fullName": "Abdullah Anwar Abdullah Binhtean",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102277": {
    "studentId": "AIU25102277",
    "fullName": "Mahmudul Hasan Sowrov",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102278": {
    "studentId": "AIU25102278",
    "fullName": "Sajjad",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102284": {
    "studentId": "AIU25102284",
    "fullName": "Abdulkodir Olayiwola Musa",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102286": {
    "studentId": "AIU25102286",
    "fullName": "Shehu Usman Abdullahi",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Data Science (Honours)"
  },
  "AIU25102290": {
    "studentId": "AIU25102290",
    "fullName": "Zaw Min Thu",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102292": {
    "studentId": "AIU25102292",
    "fullName": "Yoon Eain Thu",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102294": {
    "studentId": "AIU25102294",
    "fullName": "Soe Htet Myat",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102316": {
    "studentId": "AIU25102316",
    "fullName": "Hudhaifa Yusuf Mohamed",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102326": {
    "studentId": "AIU25102326",
    "fullName": "Wancharip Waehayee",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102338": {
    "studentId": "AIU25102338",
    "fullName": "Muhammad Salisu Turai",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102346": {
    "studentId": "AIU25102346",
    "fullName": "Abba Tamba",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102352": {
    "studentId": "AIU25102352",
    "fullName": "Mustafa Musleh Mohammed Naji Mubarz",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102357": {
    "studentId": "AIU25102357",
    "fullName": "Fahad Kaka",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102363": {
    "studentId": "AIU25102363",
    "fullName": "Sara Qateh",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102368": {
    "studentId": "AIU25102368",
    "fullName": "Salma Gulzari",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102370": {
    "studentId": "AIU25102370",
    "fullName": "Zohal Karimi",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Data Science (Honours)"
  },
  "AIU25102377": {
    "studentId": "AIU25102377",
    "fullName": "Nyjil Mini Ravi",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102384": {
    "studentId": "AIU25102384",
    "fullName": "Masoma Taqavi",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102387": {
    "studentId": "AIU25102387",
    "fullName": "Frohal Wafa",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102388": {
    "studentId": "AIU25102388",
    "fullName": "Samira Payenda",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102390": {
    "studentId": "AIU25102390",
    "fullName": "Sahar Sharifi",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102391": {
    "studentId": "AIU25102391",
    "fullName": "Zainab Atayee",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102396": {
    "studentId": "AIU25102396",
    "fullName": "Basira Malikzada",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102397": {
    "studentId": "AIU25102397",
    "fullName": "Haytham M. I. Alsenwar",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102398": {
    "studentId": "AIU25102398",
    "fullName": "Yousef A. K. Hamdouna",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102401": {
    "studentId": "AIU25102401",
    "fullName": "Abdul Karim Mhanna",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102411": {
    "studentId": "AIU25102411",
    "fullName": "Liban Mohamed Ali",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Data Science (Honours)"
  },
  "AIU25102413": {
    "studentId": "AIU25102413",
    "fullName": "Hussaini Ajimi Badu",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102419": {
    "studentId": "AIU25102419",
    "fullName": "Zalyfy Adam",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102427": {
    "studentId": "AIU25102427",
    "fullName": "Li Yangsong",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Data Science (Honours)"
  },
  "AIU25102428": {
    "studentId": "AIU25102428",
    "fullName": "Ma Shengxian",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102430": {
    "studentId": "AIU25102430",
    "fullName": "Tong Xin",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102431": {
    "studentId": "AIU25102431",
    "fullName": "Ma Yixu",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102442": {
    "studentId": "AIU25102442",
    "fullName": "Ma Ruixin",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102443": {
    "studentId": "AIU25102443",
    "fullName": "Khelef Mohamed Mussa",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102444": {
    "studentId": "AIU25102444",
    "fullName": "Fatima Salik",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102450": {
    "studentId": "AIU25102450",
    "fullName": "K A Shakhawat Tasnim",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Data Science (Honours)"
  },
  "AIU25102458": {
    "studentId": "AIU25102458",
    "fullName": "Bilal Oyeleke Soliu",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102464": {
    "studentId": "AIU25102464",
    "fullName": "Erisa Mayla Kustiyani",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Data Science (Honours)"
  },
  "AIU25102467": {
    "studentId": "AIU25102467",
    "fullName": "Hamidzan Pranajanala Bhamakerti",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102471": {
    "studentId": "AIU25102471",
    "fullName": "Muhamad Agus Rahman",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Data Science (Honours)"
  },
  "AIU25102480": {
    "studentId": "AIU25102480",
    "fullName": "Mehedhi Hassan Rafi",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102483": {
    "studentId": "AIU25102483",
    "fullName": "Abdulrazak Bello Muhammad",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102485": {
    "studentId": "AIU25102485",
    "fullName": "Afaf Abdullah Ahmed Bamaarof",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102486": {
    "studentId": "AIU25102486",
    "fullName": "Seydouba Yabara Camara",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102489": {
    "studentId": "AIU25102489",
    "fullName": "Najilah Mpindi",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102493": {
    "studentId": "AIU25102493",
    "fullName": "Somaya Allawdin",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102497": {
    "studentId": "AIU25102497",
    "fullName": "Jamal Ali",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102509": {
    "studentId": "AIU25102509",
    "fullName": "Gassi Bah-Bara Vanessa",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Data Science (Honours)"
  },
  "AIU25102518": {
    "studentId": "AIU25102518",
    "fullName": "Laye Mory Traore",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102519": {
    "studentId": "AIU25102519",
    "fullName": "Mamadou Bailo Oumou Bah",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102520": {
    "studentId": "AIU25102520",
    "fullName": "Alpha Amadou Diallo",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102527": {
    "studentId": "AIU25102527",
    "fullName": "Muna Mohammed Husen",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Data Science (Honours)"
  },
  "AIU25102528": {
    "studentId": "AIU25102528",
    "fullName": "Jafer Yenus Kemal",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102529": {
    "studentId": "AIU25102529",
    "fullName": "Abdulselam Shemsu Bedir",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102530": {
    "studentId": "AIU25102530",
    "fullName": "Hamda Muhamed Ahmed",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102534": {
    "studentId": "AIU25102534",
    "fullName": "Eshrat Jannat Turi",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Data Science (Honours)"
  },
  "AIU25102535": {
    "studentId": "AIU25102535",
    "fullName": "Mst Sabrina Zannat Eshika",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Data Science (Honours)"
  },
  "AIU25102536": {
    "studentId": "AIU25102536",
    "fullName": "Ruqia Salah Qasem Saeed Al-Robassi",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102538": {
    "studentId": "AIU25102538",
    "fullName": "Sukari Hafis",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102539": {
    "studentId": "AIU25102539",
    "fullName": "Md Rohan Islam",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102541": {
    "studentId": "AIU25102541",
    "fullName": "Md Sadekul Islam",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102544": {
    "studentId": "AIU25102544",
    "fullName": "Hisseine Korom Youssouf",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102549": {
    "studentId": "AIU25102549",
    "fullName": "Arafat Abdulraqeb Esmail Ali",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102550": {
    "studentId": "AIU25102550",
    "fullName": "Omar Alawi Salem Alkaff",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102552": {
    "studentId": "AIU25102552",
    "fullName": "Luh Nila Dhaniswara",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Data Science (Honours)"
  },
  "AIU25102558": {
    "studentId": "AIU25102558",
    "fullName": "Abdul Karim Bangura",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102559": {
    "studentId": "AIU25102559",
    "fullName": "Mohaned Amher Sadig Kamel",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102568": {
    "studentId": "AIU25102568",
    "fullName": "Momodou Lamin Jaiteh",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102569": {
    "studentId": "AIU25102569",
    "fullName": "Momodou Alpha Jallow",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Data Science (Honours)"
  },
  "AIU25102578": {
    "studentId": "AIU25102578",
    "fullName": "Fathia Adenike Olagunju",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102586": {
    "studentId": "AIU25102586",
    "fullName": "Abdullahi Amin Heilow",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102592": {
    "studentId": "AIU25102592",
    "fullName": "Akhmadaliev Bekhzodbek Umidjon Ugli",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102593": {
    "studentId": "AIU25102593",
    "fullName": "Redwan Amro A M",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Data Science (Honours)"
  },
  "AIU25102594": {
    "studentId": "AIU25102594",
    "fullName": "Duaa Yahya Eltayeb Mohamed",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Data Science (Honours)"
  },
  "AIU25102596": {
    "studentId": "AIU25102596",
    "fullName": "Elhadj Mamadou Aliou Barry",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102598": {
    "studentId": "AIU25102598",
    "fullName": "Amara Bangoura",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Data Science (Honours)"
  },
  "AIU25102604": {
    "studentId": "AIU25102604",
    "fullName": "Shamillah Aleyaga Asani",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102608": {
    "studentId": "AIU25102608",
    "fullName": "Huzaifa Mohammedsalih Ligsu",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102620": {
    "studentId": "AIU25102620",
    "fullName": "Abdulla All Hadid",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102623": {
    "studentId": "AIU25102623",
    "fullName": "Tamizhelakkiya Kasirajan",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Data Science (Honours)"
  },
  "AIU25102624": {
    "studentId": "AIU25102624",
    "fullName": "Thiya Krishnamoorthy",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Data Science (Honours)"
  },
  "AIU25102625": {
    "studentId": "AIU25102625",
    "fullName": "Prema Ganesh Moorthi",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Data Science (Honours)"
  },
  "AIU25102628": {
    "studentId": "AIU25102628",
    "fullName": "Sanusi Sani Muhammad",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Data Science (Honours)"
  },
  "AIU25102629": {
    "studentId": "AIU25102629",
    "fullName": "Yusuf Muhammad Sani",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Data Science (Honours)"
  },
  "AIU25102635": {
    "studentId": "AIU25102635",
    "fullName": "Kalil Diane",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102636": {
    "studentId": "AIU25102636",
    "fullName": "Sekouba Konate",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102639": {
    "studentId": "AIU25102639",
    "fullName": "Fode Soumah",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102641": {
    "studentId": "AIU25102641",
    "fullName": "Haji Khal Fanos",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102653": {
    "studentId": "AIU25102653",
    "fullName": "Maryam Alqadriyyah",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102673": {
    "studentId": "AIU25102673",
    "fullName": "Abdoul-Koudousse Nambiema",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102679": {
    "studentId": "AIU25102679",
    "fullName": "Alina Ahmadi",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU25102681": {
    "studentId": "AIU25102681",
    "fullName": "Muhammad Kabiru Musa",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Data Science (Honours)"
  },
  "AIU25102683": {
    "studentId": "AIU25102683",
    "fullName": "Abdulazeez Adinoyi Momohjimoh",
    "cohort": "C6",
    "yearOfStudy": 2,
    "program": "Bachelor in Data Science (Honours)"
  },
  "AIU26102018": {
    "studentId": "AIU26102018",
    "fullName": "Nur Umairah Binti Muhammed Raffi",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Information Technology (Cybersecurity) (Honours)"
  },
  "AIU26102031": {
    "studentId": "AIU26102031",
    "fullName": "Nur Aimi Maisarah Binti Amri",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Information Technology (Cybersecurity) (Honours)"
  },
  "AIU26102034": {
    "studentId": "AIU26102034",
    "fullName": "Mohamad Taufik Khaidil Bin Yusof",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU26102036": {
    "studentId": "AIU26102036",
    "fullName": "Ahmed Esam Yaslam Ahmed Masfar",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU26102044": {
    "studentId": "AIU26102044",
    "fullName": "Nasiha Radhiya Khultum Luqman",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU26102047": {
    "studentId": "AIU26102047",
    "fullName": "Usman Muhammad Aliyu",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Data Science (Honours)"
  },
  "AIU26102048": {
    "studentId": "AIU26102048",
    "fullName": "Ibrahim Hashimu",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU26102078": {
    "studentId": "AIU26102078",
    "fullName": "Abdulrazak Adamu Aliyu",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Data Science (Honours)"
  },
  "AIU26102079": {
    "studentId": "AIU26102079",
    "fullName": "Aishatu Sheriff",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU26102083": {
    "studentId": "AIU26102083",
    "fullName": "Muhammad Ibrahim",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU26102088": {
    "studentId": "AIU26102088",
    "fullName": "Htet Wai Yan Phyo",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU26102096": {
    "studentId": "AIU26102096",
    "fullName": "Dewan Mohammad Mahfuzur Rahman",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Data Science (Honours)"
  },
  "AIU26102098": {
    "studentId": "AIU26102098",
    "fullName": "Tahiru Umar",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU26102107": {
    "studentId": "AIU26102107",
    "fullName": "Madan Lal",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU26102108": {
    "studentId": "AIU26102108",
    "fullName": "Ebrima Touray",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU26102110": {
    "studentId": "AIU26102110",
    "fullName": "Nyi Min Khant",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU26102115": {
    "studentId": "AIU26102115",
    "fullName": "Sai Nay Myo Htet",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU26102117": {
    "studentId": "AIU26102117",
    "fullName": "Mahathir Alam Sanjid",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU26102131": {
    "studentId": "AIU26102131",
    "fullName": "Gemechis Fekede Tufa",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU26102132": {
    "studentId": "AIU26102132",
    "fullName": "Hafiz Tesfaye Tesgera",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU26102134": {
    "studentId": "AIU26102134",
    "fullName": "Khushi Rai",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU26102145": {
    "studentId": "AIU26102145",
    "fullName": "Ahmad Iqmal Hakimi Bin Zakaria",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Data Science (Honours)"
  },
  "AIU26102146": {
    "studentId": "AIU26102146",
    "fullName": "Haris Johan Bin Bob Johan",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Data Science (Honours)"
  },
  "AIU26102153": {
    "studentId": "AIU26102153",
    "fullName": "Idrees Namweto",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU26102166": {
    "studentId": "AIU26102166",
    "fullName": "Nurin Nabila Binti Zulkipli",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Information Technology (Cybersecurity) (Honours)"
  },
  "AIU26102185": {
    "studentId": "AIU26102185",
    "fullName": "Ahmad Fathullah Bin Afi",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Information Technology (Cybersecurity) (Honours)"
  },
  "AIU26102186": {
    "studentId": "AIU26102186",
    "fullName": "Nurul Darwisya Binti Zubir",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Information Technology (Cybersecurity) (Honours)"
  },
  "AIU26102187": {
    "studentId": "AIU26102187",
    "fullName": "Siti Noor Alieya Binti Jamal",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Information Technology (Cybersecurity) (Honours)"
  },
  "AIU26102196": {
    "studentId": "AIU26102196",
    "fullName": "Muhammad Adam Ajwad Bin Muhammad Nazli",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Data Science (Honours)"
  },
  "AIU26102197": {
    "studentId": "AIU26102197",
    "fullName": "Ebrima Colley",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Data Science (Honours)"
  },
  "AIU26102198": {
    "studentId": "AIU26102198",
    "fullName": "Tadiwa Chifamba",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Information Technology (Cybersecurity) (Honours)"
  },
  "AIU26102205": {
    "studentId": "AIU26102205",
    "fullName": "Bayan Idris Mahmoud Idris",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Data Science (Honours)"
  },
  "AIU26102215": {
    "studentId": "AIU26102215",
    "fullName": "Mohamed Irham Mohamed Ashar",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU26102216": {
    "studentId": "AIU26102216",
    "fullName": "Mohamed Usman Mohamed Rilwan",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Data Science (Honours)"
  },
  "AIU26102217": {
    "studentId": "AIU26102217",
    "fullName": "Fathima Shamla Kachchi Mohamed",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Data Science (Honours)"
  },
  "AIU26102219": {
    "studentId": "AIU26102219",
    "fullName": "Umar Zayyan Mohamed Rifaz",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Data Science (Honours)"
  },
  "AIU26102222": {
    "studentId": "AIU26102222",
    "fullName": "Mohamed Fazil Zainab",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Data Science (Honours)"
  },
  "AIU26102223": {
    "studentId": "AIU26102223",
    "fullName": "Lameeaa Ismath Udayar",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Data Science (Honours)"
  },
  "AIU26102225": {
    "studentId": "AIU26102225",
    "fullName": "Shuaib Ahamad Shibri",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU26102227": {
    "studentId": "AIU26102227",
    "fullName": "Min Khant Kyaw",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Information Technology (Cybersecurity) (Honours)"
  },
  "AIU26102231": {
    "studentId": "AIU26102231",
    "fullName": "Nur Amira Bin Mazzamberi",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Information Technology (Cybersecurity) (Honours)"
  },
  "AIU26102232": {
    "studentId": "AIU26102232",
    "fullName": "Mahthi Aathif Mohamed Mausoom",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Data Science (Honours)"
  },
  "AIU26102233": {
    "studentId": "AIU26102233",
    "fullName": "Md Nabidul Huda",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Information Technology (Cybersecurity) (Honours)"
  },
  "AIU26102234": {
    "studentId": "AIU26102234",
    "fullName": "Yi Mon Thein",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU26102235": {
    "studentId": "AIU26102235",
    "fullName": "Kaung Thiha",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU26102236": {
    "studentId": "AIU26102236",
    "fullName": "Myat Noe Eain",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Data Science (Honours)"
  },
  "AIU26102240": {
    "studentId": "AIU26102240",
    "fullName": "Nurulsuhada Chelong",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Information Technology (Cybersecurity) (Honours)"
  },
  "AIU26102248": {
    "studentId": "AIU26102248",
    "fullName": "Luqman Salum Muba",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Data Science (Honours)"
  },
  "AIU26102250": {
    "studentId": "AIU26102250",
    "fullName": "Buzurgmehr Umaralizoda",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Information Technology (Cybersecurity) (Honours)"
  },
  "AIU26102251": {
    "studentId": "AIU26102251",
    "fullName": "Mohamed Adheeb Mohamed Fawsan",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU26102252": {
    "studentId": "AIU26102252",
    "fullName": "Sumaiya Musthafa Hilmi",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Data Science (Honours)"
  },
  "AIU26102253": {
    "studentId": "AIU26102253",
    "fullName": "Ihsan Lengha",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Data Science (Honours)"
  },
  "AIU26102254": {
    "studentId": "AIU26102254",
    "fullName": "Swalha Saidi Zubery",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Information Technology (Cybersecurity) (Honours)"
  },
  "AIU26102257": {
    "studentId": "AIU26102257",
    "fullName": "Siraji Yasini Shabani",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Information Technology (Cybersecurity) (Honours)"
  },
  "AIU26102260": {
    "studentId": "AIU26102260",
    "fullName": "Luqman Hamad Hamis",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Information Technology (Cybersecurity) (Honours)"
  },
  "AIU26102261": {
    "studentId": "AIU26102261",
    "fullName": "Nazatul Isyika",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU26102269": {
    "studentId": "AIU26102269",
    "fullName": "Mohamed Arshad Mohamed Roominas",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU26102275": {
    "studentId": "AIU26102275",
    "fullName": "Thu Rein Htun",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU26102276": {
    "studentId": "AIU26102276",
    "fullName": "Min Khant Aung",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU26102277": {
    "studentId": "AIU26102277",
    "fullName": "Aunt Htoo Naing",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU26102278": {
    "studentId": "AIU26102278",
    "fullName": "May Myat Noe",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Information Technology (Cybersecurity) (Honours)"
  },
  "AIU26102279": {
    "studentId": "AIU26102279",
    "fullName": "Myint Hanni Moe",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU26102280": {
    "studentId": "AIU26102280",
    "fullName": "Wai Yan Linn",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU26102282": {
    "studentId": "AIU26102282",
    "fullName": "May Myat Noe Khin",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Information Technology (Cybersecurity) (Honours)"
  },
  "AIU26102283": {
    "studentId": "AIU26102283",
    "fullName": "May Nadi Min Htut",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU26102285": {
    "studentId": "AIU26102285",
    "fullName": "Shwe Mi",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU26102287": {
    "studentId": "AIU26102287",
    "fullName": "Nay Eain Yee",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Information Technology (Cybersecurity) (Honours)"
  },
  "AIU26102288": {
    "studentId": "AIU26102288",
    "fullName": "Amatullah Bukar Muhammad",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Data Science (Honours)"
  },
  "AIU26102307": {
    "studentId": "AIU26102307",
    "fullName": "Joanne Ervyana Jsmin",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Information Technology (Cybersecurity) (Honours)"
  },
  "AIU26102308": {
    "studentId": "AIU26102308",
    "fullName": "Muhammad Akram Hayan Bin Mohd Azrul",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Information Technology (Cybersecurity) (Honours)"
  },
  "AIU26102327": {
    "studentId": "AIU26102327",
    "fullName": "Zhu Liye",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Data Science (Honours)"
  },
  "AIU26102337": {
    "studentId": "AIU26102337",
    "fullName": "Ma Yisha",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU26102349": {
    "studentId": "AIU26102349",
    "fullName": "Bilqis Lathifatul Afifah",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Information Technology (Cybersecurity) (Honours)"
  },
  "AIU26102351": {
    "studentId": "AIU26102351",
    "fullName": "Sifen Tura Diro",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU26102352": {
    "studentId": "AIU26102352",
    "fullName": "Ezadin Mohammad Umar",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU26102355": {
    "studentId": "AIU26102355",
    "fullName": "Mebeza Kedir Mohammed",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU26102360": {
    "studentId": "AIU26102360",
    "fullName": "Melinda Kadurira",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Data Science (Honours)"
  },
  "AIU26102366": {
    "studentId": "AIU26102366",
    "fullName": "Sanni Zainab Olamide",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU26102377": {
    "studentId": "AIU26102377",
    "fullName": "Zziwa Tarik",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU26102380": {
    "studentId": "AIU26102380",
    "fullName": "Hassan Tijjani Ahmad",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Computer Science (Honours)"
  },
  "AIU26102389": {
    "studentId": "AIU26102389",
    "fullName": "Umar Abdulbasit",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Data Science (Honours)"
  },
  "AIU26102411": {
    "studentId": "AIU26102411",
    "fullName": "Nurhafizatul Haslina Binti M Wari",
    "cohort": "C7",
    "yearOfStudy": 1,
    "program": "Bachelor in Data Science (Honours)"
  }
};

const IGNORED_NAME_TOKENS = new Set([
  'bin',
  'binti',
  'bt',
  'b',
  'md',
  'm',
  'al',
  'el',
  's',
  'a',
]);

export function tokenizeSignificantNameParts(fullName: string): string[] {
  const parts = fullName
    .toLowerCase()
    .replace(/[^a-z\s]/g, ' ')
    .split(/\s+/)
    .filter((token) => token.length >= 2 && !IGNORED_NAME_TOKENS.has(token));
  return Array.from(new Set(parts));
}

export function findRosterStudent(rawId: string): RosterStudent | null {
  const normalized = normalizeAiuStudentId(rawId);
  if (!normalized) return null;
  return COHORT_ROSTER[normalized] ?? null;
}

export function getRosterByCohort(cohort: CohortCode): RosterStudent[] {
  return Object.values(COHORT_ROSTER).filter((s) => s.cohort === cohort);
}

/**
 * Verifies that the authenticated @student.aiu.edu.my email (and optional Google displayName)
 * genuinely belongs to the matched roster student, preventing Student ID guessing or hijacking.
 */
export function verifyEmailMatchesRosterStudent(
  email: string,
  googleDisplayName: string,
  student: RosterStudent
): { ok: boolean; reason?: string } {
  const cleanedEmail = email.trim().toLowerCase();
  if (!isValidAiuEmail(cleanedEmail)) {
    return {
      ok: false,
      reason: 'Only official @student.aiu.edu.my Google accounts are permitted.',
    };
  }

  const localPrefix = cleanedEmail.split('@')[0] || '';
  const compactPrefix = localPrefix.replace(/[^a-z0-9]/g, '').toUpperCase();
  const numericId = student.studentId.replace(/^AIU/i, '');

  // Rule A: Direct Student ID prefix match (e.g. aiu25102048@student.aiu.edu.my or 25102048@...)
  if (compactPrefix === student.studentId.toUpperCase() || compactPrefix === numericId) {
    return { ok: true };
  }

  // Rule B: Order-independent name token match
  const significantTokens = tokenizeSignificantNameParts(student.fullName);
  const normalizedPrefixAlpha = localPrefix.toLowerCase().replace(/[^a-z]/g, '');
  const prefixMatches = significantTokens.filter((t) => normalizedPrefixAlpha.includes(t));

  if (prefixMatches.length === 0) {
    return {
      ok: false,
      reason:
        'Your @student.aiu.edu.my account does not match the official SCI student record for this Student ID.',
    };
  }

  const normalizedDisplay = googleDisplayName.trim().toLowerCase().replace(/[^a-z\s]/g, ' ');
  const combinedMatches = new Set<string>(prefixMatches);
  if (normalizedDisplay) {
    for (const token of significantTokens) {
      if (normalizedDisplay.includes(token)) {
        combinedMatches.add(token);
      }
    }
  }

  const requiredMatches = significantTokens.length >= 2 ? 2 : 1;
  if (combinedMatches.size < requiredMatches) {
    return {
      ok: false,
      reason:
        'Email name tokens do not sufficiently match the student record for this Student ID.',
    };
  }

  return { ok: true };
}
