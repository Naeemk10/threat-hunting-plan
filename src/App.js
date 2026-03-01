import { useState, useEffect } from "react";

const phases = [
  {
    id: 1,
    title: "FOUNDATIONS",
    subtitle: "Week 1–2",
    color: "#00ff9d",
    icon: "🧱",
    days: [
      {
        day: 1,
        title: "What is Threat Hunting?",
        duration: "20 min",
        theory: "Threat hunting = proactive search for threats that evaded detection. Unlike SIEM alerts (reactive), hunters assume breach and search for evidence. The mantra: 'Assume Compromise.'",
        realExample: "APT29 (Cozy Bear) stayed in SolarWinds networks for 9 months undetected. No alerts fired. Hunters eventually found them via anomalous DNS beaconing patterns and unusual outbound traffic.",
        activities: [
          "📖 Read: MITRE ATT&CK homepage — attack.mitre.org (5 min)",
          "🔍 Find 1 recent APT report on APTnotes GitHub (5 min)",
          "✍️ Write: 3 differences between threat hunting vs. incident response (5 min)",
          "🧠 Quiz yourself: What's a TTP? What's an IOC? (5 min)"
        ],
        tools: ["MITRE ATT&CK", "APTnotes GitHub"],
        mindset: "Assume Breach Mindset",
        quiz: "What does TTP stand for and why is it more valuable than an IOC?"
      },
      {
        day: 2,
        title: "Hypothesis-Driven Hunting",
        duration: "20 min",
        theory: "Every hunt starts with a hypothesis: 'I believe an attacker is using [technique] to achieve [goal].' Sources for hypotheses: threat intel reports, CVE news, MITRE ATT&CK, red team findings.",
        realExample: "Hypothesis: 'Attackers are using LOLBins (certutil.exe) to download malware.' Hunt for certutil.exe making outbound connections — this exact technique was used in multiple ransomware campaigns including REvil.",
        activities: [
          "📖 Read MITRE T1140 (Deobfuscate/Decode Files) (5 min)",
          "✍️ Write 3 hunt hypotheses based on current threat news (5 min)",
          "🔍 Google: 'certutil.exe malware 2024' — read 1 article (5 min)",
          "🧠 Map your best hypothesis to a MITRE technique ID (5 min)"
        ],
        tools: ["MITRE ATT&CK", "Google Threat Intel", "CISA Advisories"],
        mindset: "Think Like an Attacker",
        quiz: "Write a complete hunt hypothesis sentence for T1059 (PowerShell abuse)."
      },
      {
        day: 3,
        title: "Log Sources & Data",
        duration: "20 min",
        theory: "Key log sources: Windows Event Logs, Sysmon, DNS logs, Firewall/Proxy logs, EDR telemetry. You can't hunt what you can't see. Visibility is the foundation of all hunting.",
        realExample: "Event ID 4688 (Process Creation) caught NotPetya lateral movement across enterprise networks. Without this log enabled, analysts were completely blind to the propagation.",
        activities: [
          "📖 Study Windows Event IDs: 4624, 4625, 4688, 4697, 4720, 4732 (8 min)",
          "✍️ Create a table: Log Source → What attack it detects (7 min)",
          "🧠 Quiz: What event ID = failed logon? Service installed? User added to admin group? (5 min)"
        ],
        tools: ["Windows Event Viewer", "Sysmon", "Windows Security Log Encyclopedia"],
        mindset: "Data is Your Weapon",
        quiz: "Name the Event ID for: (1) successful logon, (2) process creation, (3) new service installed."
      },
      {
        day: 4,
        title: "Sysmon Deep Dive",
        duration: "20 min",
        theory: "Sysmon extends Windows logging massively: process creation with hashes, network connections, file creation time changes, registry modifications, and more. It's a game-changer for hunters.",
        realExample: "Sysmon Event ID 1 with ParentImage=winword.exe spawning powershell.exe = Macro-based malware signature. This exact pattern caught Emotet and Qakbot infections across thousands of enterprises.",
        activities: [
          "📖 Study Sysmon Event IDs 1, 3, 7, 8, 10, 11, 13, 22 (8 min)",
          "🔍 Look up SwiftOnSecurity Sysmon config on GitHub — read the comments (5 min)",
          "✍️ Write: Which Sysmon event catches DNS queries? Network connections? Registry changes? (7 min)"
        ],
        tools: ["Sysmon by Sysinternals", "SwiftOnSecurity Sysmon Config", "ION-Storm Sysmon Config"],
        mindset: "Visibility = Power",
        quiz: "What Sysmon event ID detects when a process accesses LSASS memory?"
      },
      {
        day: 5,
        title: "MITRE ATT&CK Framework",
        duration: "20 min",
        theory: "14 Tactics, 200+ Techniques. Tactics = WHY (the goal). Techniques = HOW (the method). Sub-techniques = specific implementation. Every hunt should map to at least one technique.",
        realExample: "Tactic: Persistence. Technique: T1053 Scheduled Tasks. Used by Conti, REvil, BlackCat ransomware groups to maintain access and re-enter after reboot.",
        activities: [
          "🔍 Open ATT&CK Navigator (mitre-attack.github.io/attack-navigator) — explore 3 techniques (8 min)",
          "✍️ Map a full kill chain: Initial Access → Execution → Persistence → C2 for 1 threat actor (7 min)",
          "🧠 Quiz: What tactic does 'Pass-the-Hash' fall under? What about 'Spearphishing'? (5 min)"
        ],
        tools: ["ATT&CK Navigator", "ATT&CK Matrix", "ATT&CK Groups page"],
        mindset: "Speak the Attacker Language",
        quiz: "What is the difference between a Tactic and a Technique in ATT&CK?"
      },
      {
        day: 6,
        title: "KQL Basics for Hunters",
        duration: "20 min",
        theory: "KQL (Kusto Query Language) is used in Microsoft Sentinel and Defender. Core operators: where, project, summarize, extend, join, count. Master these = superpowers.",
        realExample: `Real hunt query to find PowerShell encoded commands:\n\nDeviceProcessEvents\n| where ProcessCommandLine contains "-EncodedCommand"\n| where InitiatingProcessFileName != "AzurePowerShell.exe"\n| project Timestamp, DeviceName, ProcessCommandLine`,
        activities: [
          "📖 Learn KQL operators: where, project, summarize, count, extend (8 min)",
          "✍️ Write a query to find processes spawned by Office apps (Word, Excel) (7 min)",
          "🧠 Test in Microsoft 365 Defender (free trial) or Sentinel demo (5 min)"
        ],
        tools: ["Microsoft Sentinel (Free Trial)", "KQL playground: aka.ms/lademo", "KQL cheatsheet"],
        mindset: "Code is Your Scalpel",
        quiz: "Write a KQL query to find all PowerShell processes that ran in the last 24 hours."
      },
      {
        day: 7,
        title: "WEEK 1 REVIEW HUNT",
        duration: "20 min",
        theory: "Full mini-hunt cycle: Hypothesis → Data Source → Query → Findings → Document. This is your first complete hunt from scratch.",
        realExample: "Mini-Hunt Target: LOLBin Abuse. Hypothesis: 'certutil.exe or mshta.exe are being used for payload delivery in our environment.'",
        activities: [
          "🎯 Write a complete hunt hypothesis statement (3 min)",
          "📊 Identify exactly which log sources and event IDs you need (3 min)",
          "💻 Write detection query in KQL (8 min)",
          "✍️ Document findings using: Hypothesis + Query + Result + Recommendation (6 min)"
        ],
        tools: ["KQL", "Hunt Report Template", "MITRE ATT&CK"],
        mindset: "Full Hunt Cycle",
        quiz: "What are the 5 steps in a complete threat hunt cycle?"
      },
      {
        day: 8,
        title: "Process Injection Hunting",
        duration: "20 min",
        theory: "T1055 - Attackers inject malicious code into legitimate processes (svchost, explorer, lsass) to hide malware from AV. Cobalt Strike, Meterpreter, and most APT toolkits use this.",
        realExample: "FIN7 injected shellcode into svchost.exe to blend with normal traffic. Detected by: Sysmon Event ID 8 (CreateRemoteThread) from unexpected source process + outbound C2 from svchost.",
        activities: [
          "📖 Read MITRE T1055 and all sub-techniques (7 min)",
          "✍️ Write Sysmon-based KQL query to detect CreateRemoteThread from non-system processes (8 min)",
          "🔍 Find 1 public incident report mentioning process injection (5 min)"
        ],
        tools: ["Sysmon Event ID 8", "Volatility (memory forensics)", "PE-sieve"],
        mindset: "See Through the Disguise",
        quiz: "What Sysmon event ID indicates process injection via CreateRemoteThread?"
      },
      {
        day: 9,
        title: "Lateral Movement Hunting",
        duration: "20 min",
        theory: "T1021 - Attackers move between machines using RDP, SMB, WMI, PsExec, WinRM. Hunt for abnormal patterns — not just tools. An admin using PsExec at 3am is suspicious.",
        realExample: "NotPetya spread via PsExec + WMI across an entire enterprise in 45 minutes. Hunt signature: admin$ shares accessed from non-IT machines + rapid sequential logins across subnets.",
        activities: [
          "📖 Study Event IDs 4624 (Type 3 = network logon), 4648, 5140 (share access) (8 min)",
          "💻 Write query: find machines connecting to >5 different hosts via SMB within 10 minutes (7 min)",
          "✍️ List 5 lateral movement IOCs you'd hunt for (5 min)"
        ],
        tools: ["Windows Event Logs", "KQL", "Zeek conn.log"],
        mindset: "Follow the Attacker's Path",
        quiz: "What Event ID and logon type indicates a network (lateral movement) logon?"
      },
      {
        day: 10,
        title: "C2 Communication Hunting",
        duration: "20 min",
        theory: "Command & Control (T1071) - Attackers beacon home via HTTP/HTTPS/DNS. Hunt for beaconing: regular, repeated connections to same IP/domain with consistent timing intervals.",
        realExample: "Cobalt Strike default beacon = every 60 seconds to C2 with jitter. Detection: DNS queries with regular timing + high request count to single domain from one host. Found in dozens of APT campaigns.",
        activities: [
          "📖 Study DNS beaconing indicators and timing analysis (7 min)",
          "💻 Write query: find hosts making >100 DNS requests/hour to the same domain (8 min)",
          "🔍 Use VirusTotal to analyze a suspicious domain — check passive DNS (5 min)"
        ],
        tools: ["DNS logs", "VirusTotal", "Zeek dns.log", "RITA (Real Intelligence Threat Analytics)"],
        mindset: "Listen to the Network",
        quiz: "What is 'jitter' in C2 beaconing and why does it matter for detection?"
      },
      {
        day: 11,
        title: "Persistence Mechanisms",
        duration: "20 min",
        theory: "T1547 Boot/Logon Autostart — Registry Run keys, Scheduled Tasks, Services, Startup folders. Attackers hide here to survive reboots and maintain long-term access.",
        realExample: "Emotet added itself to HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run with a random name. Sysmon Event ID 13 (Registry value set) with path matching Run keys = immediate red flag.",
        activities: [
          "📖 Study 5 most common persistence locations in Windows (8 min)",
          "💻 Write KQL query for scheduled tasks created by non-SYSTEM/non-admin accounts (7 min)",
          "✍️ Create a persistence hunting checklist with registry paths and event IDs (5 min)"
        ],
        tools: ["Sysmon Event ID 13", "Autoruns (Sysinternals)", "KQL"],
        mindset: "Find Their Foothold",
        quiz: "Name 3 registry paths attackers commonly use for persistence."
      },
      {
        day: 12,
        title: "Credential Hunting",
        duration: "20 min",
        theory: "T1003 OS Credential Dumping — Mimikatz targets LSASS, DCSync attacks AD, SAM database dumps. Most major breaches involve credential theft as a key step.",
        realExample: "Event ID 4656 (LSASS handle request) + Sysmon Event ID 10 (LSASS memory access from non-system process) = Mimikatz signature. This combination flagged attacks in multiple ransomware investigations.",
        activities: [
          "📖 Read: How Mimikatz accesses LSASS — understand the mechanism (7 min)",
          "💻 Write KQL query to detect LSASS memory access from non-system processes (8 min)",
          "🔍 Search 'Mimikatz detection Sigma rules GitHub' — study 2 rules (5 min)"
        ],
        tools: ["Sysmon Event ID 10", "Sigma Rules", "Windows Event ID 4656", "LSASS Protection"],
        mindset: "Protect the Keys to the Kingdom",
        quiz: "What two event IDs together strongly indicate Mimikatz usage?"
      },
      {
        day: 13,
        title: "Sigma Rules",
        duration: "20 min",
        theory: "Sigma = generic, platform-agnostic detection rules. Write once, convert to Splunk SPL / KQL / Elastic DSL / QRadar AQL. The threat hunter's universal language for sharing detections.",
        realExample: "Sigma rule 'proc_creation_win_mimikatz' detects 15+ Mimikatz variants using behavioral patterns. Used globally by thousands of SOC teams and converts to any SIEM platform.",
        activities: [
          "🔍 Browse SigmaHQ/sigma GitHub repo — find 5 rules relevant to what you've learned (8 min)",
          "💻 Convert 1 Sigma rule to KQL manually or using sigma-cli (7 min)",
          "✍️ Write your own Sigma rule for certutil.exe downloading a file (5 min)"
        ],
        tools: ["SigmaHQ GitHub", "sigma-cli", "pySigma", "Uncoder.io (online converter)"],
        mindset: "Share Knowledge, Scale Defense",
        quiz: "What are the required fields in a Sigma rule header?"
      },
      {
        day: 14,
        title: "WEEK 2 COMPLETE HUNT",
        duration: "20 min",
        theory: "Full hunt scenario combining credential theft + lateral movement. This simulates a real post-compromise investigation after an initial alert.",
        realExample: "Scenario based on real incident: Alert fires for Mimikatz activity on workstation. Hunt: Which accounts were compromised? Where did attacker go next? What data was accessed?",
        activities: [
          "🎯 Write hypothesis: Attacker used credential dumping to enable lateral movement (3 min)",
          "💻 Query 1: Find all LSASS access events in last 7 days (5 min)",
          "💻 Query 2: Find lateral movement from the compromised machine's IP (5 min)",
          "✍️ Write hunt report: Timeline + Affected hosts + IOCs + Remediation steps (7 min)"
        ],
        tools: ["KQL", "Timeline analysis", "Hunt report template"],
        mindset: "Connect the Dots",
        quiz: "What is the first thing you do after finding a compromised host in a hunt?"
      }
    ]
  },
  {
    id: 2,
    title: "INTERMEDIATE",
    subtitle: "Week 3–4",
    color: "#ff6b35",
    icon: "⚔️",
    days: [
      {
        day: 15,
        title: "Threat Intelligence Integration",
        duration: "20 min",
        theory: "Enrich hunts with CTI: IOC feeds, OSINT, threat actor profiles. TI tells you WHO is attacking and WHAT they use; you hunt for WHERE they are in your environment.",
        realExample: "FS-ISAC shared Lazarus Group IP ranges after the SWIFT banking attacks. Analysts who hunted for any connection to those IPs across client networks found 3 compromised banks that had no alerts.",
        activities: [
          "🔍 Browse OTX AlienVault (otx.alienvault.com) — find a recent threat pulse (7 min)",
          "💻 Write KQL query to match your logs against a watchlist of known bad IPs (8 min)",
          "✍️ Create a 1-page threat actor profile: Pick 1 APT group, document their TTPs (5 min)"
        ],
        tools: ["OTX AlienVault", "MISP", "VirusTotal", "Shodan", "Microsoft Sentinel Watchlists"],
        mindset: "Context is Everything",
        quiz: "What is the difference between strategic, operational, and tactical threat intelligence?"
      },
      {
        day: 16,
        title: "Living off the Land (LOLBins)",
        duration: "20 min",
        theory: "Attackers use built-in Windows tools to avoid AV detection: certutil, mshta, regsvr32, wmic, bitsadmin, rundll32, cmstp. These are signed Microsoft binaries — AV trusts them.",
        realExample: "APT32 (OceanLotus) used regsvr32.exe /s /n /u /i:[URL] scrobj.dll to execute remote malicious COM object — the 'Squiblydoo' technique. AV = silent. Sysmon with good config = loud alert.",
        activities: [
          "📖 Read LOLBAS project website: lolbas-project.github.io — study 10 entries (7 min)",
          "💻 Write detection queries for top 5 LOLBin abuse patterns (8 min)",
          "✍️ Create your LOLBin hunting cheatsheet with process names + suspicious args (5 min)"
        ],
        tools: ["LOLBAS Project", "Sysmon", "KQL", "GTFOBins (Linux equivalent)"],
        mindset: "The Land is Their Weapon",
        quiz: "Name 5 Windows built-in tools commonly abused by attackers and what they do."
      },
      {
        day: 17,
        title: "Memory Forensics Intro",
        duration: "20 min",
        theory: "Fileless malware lives only in RAM — no disk artifacts. Volatility framework analyzes memory dumps to find injected shellcode, hidden processes, network connections, and encryption keys.",
        realExample: "PowerShell Empire payload operated entirely in RAM. Disk forensics found nothing. Memory forensics revealed full shellcode + C2 IP + compromised user token — complete picture.",
        activities: [
          "📖 Read Volatility 3 quickstart documentation (8 min)",
          "🔍 Watch: 'Volatility memory forensics walkthrough' on YouTube — 1 video (7 min)",
          "✍️ List 8 Volatility plugins and what each one detects (5 min)"
        ],
        tools: ["Volatility 3", "MemProcFS", "Rekall", "WinPmem (memory acquisition)"],
        mindset: "Catch What Leaves No Files",
        quiz: "What Volatility plugin would you use to find injected code in a process?"
      },
      {
        day: 18,
        title: "Network Traffic Analysis",
        duration: "20 min",
        theory: "Zeek/Bro generates structured logs from raw packets: conn.log, dns.log, http.log, ssl.log. Hunt for: large data transfers (exfil), unusual ports, beaconing, certificate anomalies.",
        realExample: "DNS exfiltration: data encoded in subdomain queries. Normal DNS = few unique domains per hour. Exfil = thousands of unique 63-char subdomains all resolving to same IP. Caught via entropy analysis.",
        activities: [
          "📖 Study Zeek DNS log and conn.log fields (7 min)",
          "💻 Write query: find hosts with >500 unique subdomain queries per hour (8 min)",
          "🔍 Download a PCAP from malware-traffic-analysis.net and open in Wireshark (5 min)"
        ],
        tools: ["Zeek", "Wireshark", "malware-traffic-analysis.net", "NetworkMiner"],
        mindset: "The Wire Doesn't Lie",
        quiz: "What is DNS tunneling and what statistical anomaly does it create in logs?"
      },
      {
        day: 19,
        title: "Cloud Hunting (Azure/AWS)",
        duration: "20 min",
        theory: "Cloud attacks: IAM abuse, impossible travel logins, API enumeration, S3/Blob exposure. Cloud logs: CloudTrail (AWS), Azure Activity Log, GCP Cloud Audit Logs.",
        realExample: "Capital One breach: attacker exploited SSRF to steal IAM role credentials from EC2 metadata service, then ran ListBuckets on all S3 buckets. CloudTrail showed the exact API calls — clearly visible in hindsight.",
        activities: [
          "📖 Study AWS CloudTrail key event types: AssumeRole, ListBuckets, GetObject (8 min)",
          "💻 Write KQL query for impossible travel: same user logging in from 2 countries within 1 hour (7 min)",
          "✍️ List 5 cloud-specific attack TTPs and their log signatures (5 min)"
        ],
        tools: ["AWS CloudTrail", "Microsoft Sentinel UEBA", "Stratus Red Team", "Pacu (AWS exploitation)"],
        mindset: "The Cloud Has No Perimeter",
        quiz: "What CloudTrail event indicates an attacker is enumerating S3 buckets?"
      },
      {
        day: 20,
        title: "Ransomware Hunt",
        duration: "20 min",
        theory: "Pre-ransomware indicators (72hr before encryption): discovery commands (net use, ipconfig, nltest, ADFind), credential dumping, shadow copy deletion, large-scale file reads.",
        realExample: "Conti ransomware playbook (leaked): ADFind.exe for AD recon → Cobalt Strike for C2 → LSASS dump → lateral movement → vssadmin delete shadows → deploy encryptor. Every step detectable.",
        activities: [
          "📖 Google 'Conti ransomware playbook leaked' — read the TTP list (8 min)",
          "💻 Write query: detect vssadmin.exe or wbadmin deleting shadow copies (7 min)",
          "✍️ Create a pre-ransomware indicator checklist of 10 items (5 min)"
        ],
        tools: ["KQL", "CISA Ransomware Advisories", "No More Ransom project", "Ransomware tracker"],
        mindset: "Stop it Before the Encryption",
        quiz: "Name 5 pre-ransomware indicators you can hunt for before encryption starts."
      },
      {
        day: 21,
        title: "Hunt Documentation & Reporting",
        duration: "20 min",
        theory: "A hunt with no documentation = hunt that never happened. Professional report structure: Executive Summary → Hypothesis → Data Sources → Analysis → Findings → Recommendations → Detections Created.",
        realExample: "Mandiant hunt reports become public threat intelligence that the entire industry uses. Clear, structured documentation from their hunts led to industry-wide detection improvements and new MITRE techniques being documented.",
        activities: [
          "📖 Find and read 1 public threat hunt report (Mandiant, CrowdStrike, Secureworks) (7 min)",
          "✍️ Create your personal hunt report template in Notion/Word/Markdown (8 min)",
          "🧠 List: what makes a great hunt report vs. a poor one? (5 min)"
        ],
        tools: ["Notion", "Confluence", "Hunt Report Template", "Jupyter Notebooks"],
        mindset: "Share Knowledge = Multiply Defense",
        quiz: "What are the 6 sections every professional hunt report should include?"
      }
    ]
  },
  {
    id: 3,
    title: "ADVANCED",
    subtitle: "Week 5–6",
    color: "#a855f7",
    icon: "🎯",
    days: [
      {
        day: 22,
        title: "TTP-Based Hunting at Scale",
        duration: "20 min",
        theory: "Move beyond IOCs (IPs, hashes — expire in hours) to behaviors and TTPs (last years). The Pyramid of Pain: Hash → IP → Domain → Network artifact → Tools → TTPs. Higher = harder for attackers to change.",
        realExample: "IOC approach: Block specific Cobalt Strike C2 IP → attacker spins up new IP in 30 minutes. TTP approach: Detect process injection pattern → blocks ALL Cobalt Strike variants indefinitely.",
        activities: [
          "📖 Read 'Pyramid of Pain' blog by David Bianco (Google it) (8 min)",
          "✍️ Rewrite 3 of your IOC-based detections as pure behavioral detections (7 min)",
          "🧠 For each detection: rate it on the Pyramid — hash, IP, domain, or TTP? (5 min)"
        ],
        tools: ["ATT&CK", "Pyramid of Pain", "Detection Engineering frameworks"],
        mindset: "Make It Expensive for Attackers",
        quiz: "Why is detecting TTPs more valuable than detecting file hashes?"
      },
      {
        day: 23,
        title: "Red Team Thinking for Defenders",
        duration: "20 min",
        theory: "Best hunters think like attackers. Study offensive tools — not to use them, but to know their artifacts. Cobalt Strike, BloodHound, Rubeus, Mimikatz all leave unique traces.",
        realExample: "BloodHound (AD enumeration for attackers) creates very specific LDAP queries that map all admin paths. Defender hunt: LDAP queries from non-DC machines with specific attribute combinations = BloodHound running.",
        activities: [
          "📖 Study BloodHound artifacts and what log entries it creates (8 min)",
          "💻 Write KQL query to detect BloodHound-style AD enumeration from workstations (7 min)",
          "🔍 Read HackTricks.xyz for 1 attack technique, then write its detection rule (5 min)"
        ],
        tools: ["BloodHound", "Purple Team exercises", "Atomic Red Team", "VECTR"],
        mindset: "Fight Fire With Fire",
        quiz: "What makes Atomic Red Team useful for threat hunters specifically?"
      },
      {
        day: 24,
        title: "UEBA & Behavioral Analytics",
        duration: "20 min",
        theory: "UEBA = User and Entity Behavior Analytics. Establish baselines → detect statistical anomalies. ML-powered but always requires human validation. Reduces false positives dramatically.",
        realExample: "Insider threat case: Employee accessed 10x their average file count in their final week before resignation. UEBA risk score spiked. Hunter confirmed: 50GB exfiltrated to personal cloud storage.",
        activities: [
          "📖 Study UEBA concepts: baselining, anomaly scoring, peer group analysis (8 min)",
          "💻 Write query: find users accessing >3x their 30-day average file count today (7 min)",
          "✍️ Define normal baselines for: login times, data transfer volumes, app usage (5 min)"
        ],
        tools: ["Microsoft Sentinel UEBA", "Exabeam", "Splunk UBA", "Elastic SIEM"],
        mindset: "Normal is Your North Star",
        quiz: "What is 'peer group analysis' in UEBA and why is it useful?"
      },
      {
        day: 25,
        title: "Building a Hunt Program",
        duration: "20 min",
        theory: "A mature hunt program is repeatable and measurable: hunt library, rotation schedule, metrics tracking, red team integration, and feedback loop back to detection engineering.",
        realExample: "Uber's hunt team runs 50+ recurring hunts monthly, each continuously tuned from past findings and red team exercises. Key metrics: Mean Time to Detect (MTTD), hunts per month, new detections generated.",
        activities: [
          "📖 Read SANS Threat Hunting Survey — find it via Google (7 min)",
          "✍️ Design your personal hunt program: weekly cadence + priority areas (8 min)",
          "🧠 Define 5 metrics you'd use to prove your hunt program's value to management (5 min)"
        ],
        tools: ["SANS Reading Room", "TaHiTI Hunting Maturity Model", "HMM (Hunt Maturity Model)"],
        mindset: "Build the Machine",
        quiz: "What is the TaHiTI model and what does it measure?"
      },
      {
        day: 26,
        title: "CTF Lab Practice Day",
        duration: "20 min",
        theory: "Theory without practice = forgotten. CTF challenges build muscle memory for real hunts. Real PCAP files and log sets from actual incidents — perfect training data.",
        realExample: "BTLO and CyberDefenders challenges are built from real incident data. 'The Planets' Splunk challenge reconstructed an actual APT intrusion — analysts who completed it later recognized the same patterns in real cases.",
        activities: [
          "🎮 Go to cyberdefenders.org — complete 1 beginner/medium challenge (15 min)",
          "✍️ Document: your methodology, queries used, what you found, what you missed (5 min)"
        ],
        tools: ["CyberDefenders.org", "Blue Team Labs Online (BTLO)", "Boss of the SOC (BOTS)", "LetsDefend.io"],
        mindset: "Reps Build Reflexes",
        quiz: "What did you learn from the CTF that you didn't expect?"
      },
      {
        day: 27,
        title: "🏆 FINAL HUNT PROJECT",
        duration: "20 min",
        theory: "You've completed the full curriculum. This final hunt is yours — pick a current, real threat actor, build your hypothesis from their latest TTPs, hunt for them, and document everything professionally.",
        realExample: "Hunt the latest threat: Search for '[threat actor] 2024 TTPs' — pick Midnight Blizzard, Scattered Spider, or any active group. Build your hunt around their actual, current techniques.",
        activities: [
          "📰 Pick 1 active threat actor from this week's security news (3 min)",
          "🎯 Write 3 hunt hypotheses based on their documented TTPs (5 min)",
          "💻 Write 3 detection queries targeting their specific behaviors (7 min)",
          "✍️ Complete a full professional hunt report — all sections (5 min)"
        ],
        tools: ["Everything you've learned", "All tools in your arsenal"],
        mindset: "🎯 You Are the Hunter Now",
        quiz: "What will you hunt for next week?"
      }
    ]
  }
];

const resources = [
  { name: "MITRE ATT&CK", url: "https://attack.mitre.org", type: "Framework", color: "#00ff9d", desc: "The essential attacker TTP framework" },
  { name: "ATT&CK Navigator", url: "https://mitre-attack.github.io/attack-navigator", type: "Framework", color: "#00ff9d", desc: "Visualize and plan hunts" },
  { name: "SigmaHQ Rules", url: "https://github.com/SigmaHQ/sigma", type: "Detection", color: "#00ff9d", desc: "3000+ detection rules" },
  { name: "LOLBAS Project", url: "https://lolbas-project.github.io", type: "Reference", color: "#ff6b35", desc: "Living off the land binaries" },
  { name: "CyberDefenders", url: "https://cyberdefenders.org", type: "Lab", color: "#ff6b35", desc: "Blue team CTF challenges" },
  { name: "Blue Team Labs Online", url: "https://blueteamlabs.online", type: "Lab", color: "#ff6b35", desc: "Defensive security practice" },
  { name: "malware-traffic-analysis", url: "https://malware-traffic-analysis.net", type: "Lab", color: "#ff6b35", desc: "Real malware PCAPs" },
  { name: "Atomic Red Team", url: "https://github.com/redcanaryco/atomic-red-team", type: "Lab", color: "#ff6b35", desc: "Test your detections" },
  { name: "OTX AlienVault", url: "https://otx.alienvault.com", type: "Threat Intel", color: "#a855f7", desc: "Community threat feeds" },
  { name: "VirusTotal", url: "https://virustotal.com", type: "Threat Intel", color: "#a855f7", desc: "Hash/IP/domain analysis" },
  { name: "Splunk BOTS", url: "https://bots.splunk.com", type: "Practice", color: "#a855f7", desc: "Boss of the SOC challenges" },
  { name: "LetsDefend", url: "https://letsdefend.io", type: "Practice", color: "#a855f7", desc: "SOC analyst training platform" },
  { name: "KQL Playground", url: "https://aka.ms/lademo", type: "Tool", color: "#3b82f6", desc: "Practice KQL online" },
  { name: "Uncoder.io", url: "https://uncoder.io", type: "Tool", color: "#3b82f6", desc: "Convert Sigma to any SIEM" },
  { name: "CISA Advisories", url: "https://www.cisa.gov/news-events/cybersecurity-advisories", type: "Tool", color: "#3b82f6", desc: "Official threat advisories" },
];

const queries = [
  {
    label: "LOLBin Abuse — Office spawning shells (KQL)",
    code: `DeviceProcessEvents
| where InitiatingProcessFileName in~ 
    ("winword.exe","excel.exe","powerpnt.exe","outlook.exe")
| where FileName in~ 
    ("powershell.exe","cmd.exe","wscript.exe","mshta.exe","certutil.exe")
| project Timestamp, DeviceName, InitiatingProcessFileName, 
    FileName, ProcessCommandLine`
  },
  {
    label: "LSASS Memory Access — Mimikatz Detection (KQL)",
    code: `DeviceEvents
| where ActionType == "OpenProcessApiCall"
| where FileName =~ "lsass.exe"
| where not(InitiatingProcessFileName in~ 
    ("MsMpEng.exe","taskmgr.exe","csrss.exe","werfault.exe"))
| project Timestamp, DeviceName, InitiatingProcessFileName, 
    InitiatingProcessCommandLine`
  },
  {
    label: "DNS Beaconing Detection (KQL)",
    code: `DnsEvents
| where TimeGenerated > ago(1h)
| summarize RequestCount=count(), 
    UniqueIPs=dcount(ClientIP) by Name
| where RequestCount > 200
| order by RequestCount desc
| project Name, RequestCount, UniqueIPs`
  },
  {
    label: "Shadow Copy Deletion — Pre-Ransomware (KQL)",
    code: `DeviceProcessEvents
| where FileName in~ ("vssadmin.exe","wbadmin.exe","wmic.exe")
| where ProcessCommandLine has_any 
    ("delete shadows","shadowcopy delete","catalog -quiet")
| project Timestamp, DeviceName, AccountName, 
    ProcessCommandLine`
  },
  {
    label: "Impossible Travel Detection (KQL)",
    code: `SigninLogs
| where TimeGenerated > ago(1d)
| project TimeGenerated, UserPrincipalName, 
    Location, IPAddress
| order by UserPrincipalName, TimeGenerated asc
| serialize
| extend PrevLocation = prev(Location),
    PrevUser = prev(UserPrincipalName),
    PrevTime = prev(TimeGenerated)
| where UserPrincipalName == PrevUser
| where Location != PrevLocation
| where datetime_diff('minute', TimeGenerated, PrevTime) < 60`
  },
  {
    label: "Lateral Movement — SMB Spray (KQL)",
    code: `DeviceNetworkEvents
| where RemotePort == 445
| where TimeGenerated > ago(1h)
| summarize TargetCount=dcount(RemoteIP) by 
    DeviceName, InitiatingProcessFileName
| where TargetCount > 10
| order by TargetCount desc`
  }
];

export default function App() {
  const [selectedPhase, setSelectedPhase] = useState(0);
  const [selectedDay, setSelectedDay] = useState(null);
  const [completedDays, setCompletedDays] = useState(() => {
    try {
      const saved = localStorage.getItem("th_completed");
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch { return new Set(); }
  });
  const [view, setView] = useState("plan");
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);

  useEffect(() => {
    localStorage.setItem("th_completed", JSON.stringify([...completedDays]));
  }, [completedDays]);

  const toggleComplete = (dayNum) => {
    setCompletedDays(prev => {
      const next = new Set(prev);
      next.has(dayNum) ? next.delete(dayNum) : next.add(dayNum);
      return next;
    });
  };

  const copyQuery = (idx, code) => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const currentPhase = phases[selectedPhase];
  const totalCompleted = completedDays.size;
  const pct = Math.round((totalCompleted / 27) * 100);

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "#e2e8f0", fontFamily: "'Courier New', monospace" }}>

      {/* HEADER */}
      <div style={{
        background: "linear-gradient(135deg, #0d1117 0%, #161b22 100%)",
        borderBottom: "1px solid #00ff9d20",
        padding: "16px 20px",
        position: "sticky", top: 0, zIndex: 100,
        boxShadow: "0 4px 40px #00000080"
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, maxWidth: 1200, margin: "0 auto" }}>
          <div>
            <div style={{ fontSize: 10, color: "#00ff9d", letterSpacing: 4 }}>▸ SOC ANALYST PROGRAM</div>
            <div style={{ fontSize: 20, fontWeight: "bold", color: "#fff", letterSpacing: 1 }}>
              THREAT HUNTING: CRASH → ADVANCED
            </div>
            <div style={{ fontSize: 10, color: "#475569" }}>27 Days · 20 Min/Day · Real World Examples · Progress Saved</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: "bold", color: "#00ff9d" }}>{totalCompleted}<span style={{ fontSize: 12, color: "#475569" }}>/27</span></div>
              <div style={{ fontSize: 9, color: "#475569" }}>DAYS DONE</div>
            </div>
            <div>
              <div style={{ fontSize: 9, color: "#475569", marginBottom: 4, textAlign: "right" }}>{pct}% COMPLETE</div>
              <div style={{ background: "#1e293b", borderRadius: 4, height: 6, width: 120 }}>
                <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg, #00ff9d, #a855f7)", borderRadius: 4, transition: "width 0.5s" }} />
              </div>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap", maxWidth: 1200, margin: "12px auto 0" }}>
          {["plan", "queries", "resources"].map(v => (
            <button key={v} onClick={() => setView(v)} style={{
              padding: "5px 14px", borderRadius: 5, border: "1px solid",
              borderColor: view === v ? "#00ff9d" : "#1e293b",
              background: view === v ? "#00ff9d15" : "transparent",
              color: view === v ? "#00ff9d" : "#64748b",
              cursor: "pointer", fontSize: 10, letterSpacing: 2, textTransform: "uppercase"
            }}>{v}</button>
          ))}
        </div>
      </div>

      {/* PLAN VIEW */}
      {view === "plan" && (
        <div style={{ display: "flex", maxWidth: 1200, margin: "0 auto" }}>
          {/* Sidebar */}
          <div style={{ width: 200, background: "#0d1117", borderRight: "1px solid #1e293b", minHeight: "calc(100vh - 110px)", flexShrink: 0, padding: "16px 0" }}>
            {phases.map((phase, i) => {
              const done = phase.days.filter(d => completedDays.has(d.day)).length;
              return (
                <button key={phase.id} onClick={() => { setSelectedPhase(i); setSelectedDay(null); setShowQuiz(false); }} style={{
                  width: "100%", textAlign: "left", padding: "14px 16px",
                  background: selectedPhase === i ? `${phase.color}12` : "transparent",
                  border: "none", borderLeft: `3px solid ${selectedPhase === i ? phase.color : "transparent"}`,
                  cursor: "pointer", color: selectedPhase === i ? phase.color : "#64748b", transition: "all 0.2s"
                }}>
                  <div style={{ fontSize: 20, marginBottom: 3 }}>{phase.icon}</div>
                  <div style={{ fontSize: 12, fontWeight: "bold", letterSpacing: 1 }}>{phase.title}</div>
                  <div style={{ fontSize: 9, opacity: 0.6 }}>{phase.subtitle}</div>
                  <div style={{ marginTop: 6, background: "#1e293b", borderRadius: 2, height: 3 }}>
                    <div style={{ height: "100%", width: `${(done / phase.days.length) * 100}%`, background: phase.color, borderRadius: 2, transition: "width 0.3s" }} />
                  </div>
                  <div style={{ fontSize: 9, color: "#475569", marginTop: 3 }}>{done}/{phase.days.length} done</div>
                </button>
              );
            })}
          </div>

          {/* Main */}
          <div style={{ flex: 1, padding: "20px", overflow: "auto" }}>
            {selectedDay === null ? (
              <div>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 10, color: currentPhase.color, letterSpacing: 3 }}>PHASE {currentPhase.id} · {currentPhase.subtitle}</div>
                  <div style={{ fontSize: 22, fontWeight: "bold", color: "#fff" }}>{currentPhase.icon} {currentPhase.title}</div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
                  {currentPhase.days.map(day => (
                    <div key={day.day} onClick={() => { setSelectedDay(day); setShowQuiz(false); }}
                      style={{
                        background: "#0d1117", border: `1px solid ${completedDays.has(day.day) ? currentPhase.color + "60" : "#1e293b"}`,
                        borderRadius: 10, padding: "16px", cursor: "pointer", transition: "all 0.2s", position: "relative"
                      }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = currentPhase.color}
                      onMouseLeave={e => e.currentTarget.style.borderColor = completedDays.has(day.day) ? currentPhase.color + "60" : "#1e293b"}
                    >
                      {completedDays.has(day.day) && (
                        <div style={{ position: "absolute", top: 10, right: 12, color: currentPhase.color, fontSize: 14 }}>✓</div>
                      )}
                      <div style={{ fontSize: 9, color: "#475569", letterSpacing: 2, marginBottom: 5 }}>DAY {day.day} · {day.duration}</div>
                      <div style={{ fontSize: 13, fontWeight: "bold", color: "#e2e8f0", marginBottom: 6, lineHeight: 1.3 }}>{day.title}</div>
                      <div style={{ fontSize: 11, color: "#475569", lineHeight: 1.5, marginBottom: 10 }}>{day.theory.slice(0, 90)}...</div>
                      <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                        {day.tools.slice(0, 2).map(t => (
                          <span key={t} style={{ fontSize: 9, padding: "2px 7px", background: `${currentPhase.color}12`, border: `1px solid ${currentPhase.color}25`, borderRadius: 3, color: currentPhase.color }}>{t}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ maxWidth: 780 }}>
                <button onClick={() => { setSelectedDay(null); setShowQuiz(false); }} style={{
                  background: "transparent", border: "1px solid #1e293b", color: "#64748b",
                  padding: "5px 12px", borderRadius: 5, cursor: "pointer", marginBottom: 16, fontSize: 10, letterSpacing: 1
                }}>← BACK</button>

                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {/* Title card */}
                  <div style={{ background: "#0d1117", border: `1px solid ${currentPhase.color}40`, borderRadius: 12, padding: "22px", boxShadow: `0 0 30px ${currentPhase.color}08` }}>
                    <div style={{ fontSize: 9, color: currentPhase.color, letterSpacing: 3, marginBottom: 4 }}>DAY {selectedDay.day} · {selectedDay.duration} · {currentPhase.title}</div>
                    <div style={{ fontSize: 22, fontWeight: "bold", color: "#fff", marginBottom: 10 }}>{selectedDay.title}</div>
                    <span style={{ display: "inline-block", background: `${currentPhase.color}18`, border: `1px solid ${currentPhase.color}35`, borderRadius: 20, padding: "4px 14px", fontSize: 10, color: currentPhase.color }}>
                      🧠 {selectedDay.mindset}
                    </span>
                  </div>

                  {/* Theory */}
                  <div style={{ background: "#0d1117", border: "1px solid #1e293b", borderRadius: 10, padding: "18px" }}>
                    <div style={{ fontSize: 9, color: "#64748b", letterSpacing: 3, marginBottom: 10 }}>📚 THEORY</div>
                    <div style={{ fontSize: 13, color: "#cbd5e1", lineHeight: 1.8 }}>{selectedDay.theory}</div>
                  </div>

                  {/* Real example */}
                  <div style={{ background: "#050d1a", border: "1px solid #1d4ed830", borderLeft: "3px solid #3b82f6", borderRadius: 10, padding: "18px" }}>
                    <div style={{ fontSize: 9, color: "#3b82f6", letterSpacing: 3, marginBottom: 10 }}>🌐 REAL WORLD EXAMPLE</div>
                    <div style={{ fontSize: 12, color: "#93c5fd", lineHeight: 1.8, whiteSpace: "pre-wrap", fontFamily: "monospace" }}>{selectedDay.realExample}</div>
                  </div>

                  {/* Activities */}
                  <div style={{ background: "#0d1117", border: "1px solid #1e293b", borderRadius: 10, padding: "18px" }}>
                    <div style={{ fontSize: 9, color: "#64748b", letterSpacing: 3, marginBottom: 12 }}>⚡ TODAY'S ACTIVITIES (20 MIN)</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {selectedDay.activities.map((act, i) => (
                        <div key={i} style={{ display: "flex", gap: 10, padding: "10px 12px", background: "#161b22", borderRadius: 7, border: "1px solid #1e293b", fontSize: 12, color: "#e2e8f0", lineHeight: 1.5 }}>
                          <span style={{ color: currentPhase.color, flexShrink: 0, fontSize: 9, marginTop: 2, fontWeight: "bold" }}>{String(i + 1).padStart(2, "0")}</span>
                          {act}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tools */}
                  <div style={{ background: "#0d1117", border: "1px solid #1e293b", borderRadius: 10, padding: "18px" }}>
                    <div style={{ fontSize: 9, color: "#64748b", letterSpacing: 3, marginBottom: 10 }}>🛠 TOOLS</div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {selectedDay.tools.map(t => (
                        <span key={t} style={{ padding: "7px 14px", background: `${currentPhase.color}12`, border: `1px solid ${currentPhase.color}25`, borderRadius: 20, color: currentPhase.color, fontSize: 11, letterSpacing: 1 }}>{t}</span>
                      ))}
                    </div>
                  </div>

                  {/* Quiz */}
                  <div style={{ background: "#0d1117", border: "1px solid #1e293b", borderRadius: 10, padding: "18px" }}>
                    <div style={{ fontSize: 9, color: "#64748b", letterSpacing: 3, marginBottom: 10 }}>🎯 SELF-CHECK QUIZ</div>
                    {!showQuiz ? (
                      <button onClick={() => setShowQuiz(true)} style={{ padding: "10px 18px", background: "#161b22", border: "1px solid #1e293b", color: "#94a3b8", borderRadius: 7, cursor: "pointer", fontSize: 11, letterSpacing: 1 }}>
                        REVEAL QUIZ QUESTION
                      </button>
                    ) : (
                      <div style={{ background: "#161b22", border: `1px solid ${currentPhase.color}25`, borderRadius: 7, padding: "14px", fontSize: 13, color: currentPhase.color, lineHeight: 1.6 }}>
                        ❓ {selectedDay.quiz}
                      </div>
                    )}
                  </div>

                  {/* Complete button */}
                  <button onClick={() => toggleComplete(selectedDay.day)} style={{
                    padding: "14px", background: completedDays.has(selectedDay.day) ? `${currentPhase.color}25` : `${currentPhase.color}12`,
                    border: `1px solid ${currentPhase.color}`, borderRadius: 10,
                    color: currentPhase.color, fontSize: 12, fontWeight: "bold", cursor: "pointer", letterSpacing: 2, transition: "all 0.2s"
                  }}>
                    {completedDays.has(selectedDay.day) ? "✓ COMPLETED — CLICK TO UNDO" : "✓ MARK DAY COMPLETE"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* QUERIES VIEW */}
      {view === "queries" && (
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 20px" }}>
          <div style={{ fontSize: 10, color: "#ff6b35", letterSpacing: 3, marginBottom: 4 }}>DETECTION QUERIES</div>
          <div style={{ fontSize: 22, fontWeight: "bold", color: "#fff", marginBottom: 6 }}>Hunt Query Cheatsheet</div>
          <div style={{ fontSize: 12, color: "#475569", marginBottom: 24 }}>Ready-to-use KQL queries. Click COPY to grab any query.</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {queries.map((q, idx) => (
              <div key={idx} style={{ background: "#0d1117", border: "1px solid #1e293b", borderRadius: 10, overflow: "hidden" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 16px", background: "#161b22", borderBottom: "1px solid #1e293b" }}>
                  <div style={{ fontSize: 11, color: "#ff6b35", letterSpacing: 1 }}>{q.label}</div>
                  <button onClick={() => copyQuery(idx, q.code)} style={{
                    padding: "4px 12px", background: copiedIdx === idx ? "#00ff9d20" : "#1e293b",
                    border: `1px solid ${copiedIdx === idx ? "#00ff9d" : "#2d3748"}`,
                    color: copiedIdx === idx ? "#00ff9d" : "#64748b",
                    borderRadius: 4, cursor: "pointer", fontSize: 10, letterSpacing: 1
                  }}>
                    {copiedIdx === idx ? "COPIED!" : "COPY"}
                  </button>
                </div>
                <pre style={{ margin: 0, padding: "16px", fontSize: 12, color: "#00ff9d", fontFamily: "'Courier New', monospace", overflowX: "auto", lineHeight: 1.7 }}>{q.code}</pre>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RESOURCES VIEW */}
      {view === "resources" && (
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "24px 20px" }}>
          <div style={{ fontSize: 10, color: "#a855f7", letterSpacing: 3, marginBottom: 4 }}>ARSENAL</div>
          <div style={{ fontSize: 22, fontWeight: "bold", color: "#fff", marginBottom: 6 }}>Threat Hunter's Resource Library</div>
          <div style={{ fontSize: 12, color: "#475569", marginBottom: 24 }}>All tools, platforms, and references used throughout the 27-day program.</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
            {resources.map(r => (
              <div key={r.name} style={{ background: "#0d1117", border: "1px solid #1e293b", borderRadius: 10, padding: "16px", transition: "all 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = r.color}
                onMouseLeave={e => e.currentTarget.style.borderColor = "#1e293b"}
              >
                <div style={{ fontSize: 9, padding: "2px 8px", display: "inline-block", background: `${r.color}18`, color: r.color, borderRadius: 3, letterSpacing: 1, marginBottom: 8 }}>{r.type}</div>
                <div style={{ fontSize: 13, fontWeight: "bold", color: "#e2e8f0", marginBottom: 4 }}>{r.name}</div>
                <div style={{ fontSize: 11, color: "#475569", marginBottom: 12 }}>{r.desc}</div>
                <a href={r.url} target="_blank" rel="noreferrer" style={{ display: "block", textAlign: "center", padding: "7px", background: `${r.color}12`, border: `1px solid ${r.color}25`, borderRadius: 6, color: r.color, textDecoration: "none", fontSize: 10, letterSpacing: 1 }}>OPEN →</a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
