"""Populate GJU majors, German partner universities, and embassy visa steps."""

from __future__ import annotations

import sys
from pathlib import Path

from sqlalchemy import select

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from app.database import Base, SessionLocal, engine  # noqa: E402
from app.models.major import Major  # noqa: E402
from app.models.university import University  # noqa: E402
from app.models.visa_step import VisaStep  # noqa: E402

MAJORS: list[dict[str, str]] = [
    {"name": "Computer Science", "school": "SICS"},
    {"name": "Computer Engineering", "school": "SICS"},
    {"name": "Cyber Security", "school": "SICS"},
    {"name": "Management Sciences", "school": "SBE"},
    {"name": "International Accounting", "school": "SBE"},
    {"name": "Logistics Sciences", "school": "SBE"},
    {"name": "Electrical Engineering", "school": "SEEET"},
    {"name": "Mechatronics Engineering", "school": "SEEET"},
    {"name": "Energy Engineering", "school": "SEEET"},
    {"name": "Mechanical Engineering", "school": "SATS"},
    {"name": "Industrial Engineering", "school": "SATS"},
    {"name": "Architecture", "school": "SABE"},
    {"name": "Civil Engineering", "school": "SABE"},
    {"name": "Design and Visual Communication", "school": "SABE"},
    {"name": "Biomedical Engineering", "school": "SAMS"},
    {"name": "Pharmaceutical and Chemical Engineering", "school": "SAMS"},
    {"name": "Translation (German–English–Arabic)", "school": "SAHL"},
    {"name": "Water and Environmental Engineering", "school": "SNREM"},
]

UNIVERSITIES: list[dict] = [
    {
        "name": "HTW Berlin",
        "city": "Berlin",
        "state": "Berlin",
        "min_german_level": "B2",
        "min_english_level": "B2",
        "website_url": "https://www.htw-berlin.de/",
        "description": (
            "University of Applied Sciences for Engineering and Economics. Strong GJU partner for "
            "computer science, business, and engineering internships in Berlin's startup and industry scene."
        ),
        "majors": ["Computer Science", "Computer Engineering", "Management Sciences", "International Accounting"],
    },
    {
        "name": "FH Aachen",
        "city": "Aachen",
        "state": "North Rhine-Westphalia",
        "min_german_level": "B1",
        "min_english_level": "B2",
        "website_url": "https://www.fh-aachen.de/",
        "description": (
            "Long-standing GJU partner with dual-study and internship links near RWTH Aachen. "
            "Popular for mechatronics, mechanical, and electrical engineering."
        ),
        "majors": ["Mechatronics Engineering", "Mechanical Engineering", "Electrical Engineering", "Energy Engineering"],
    },
    {
        "name": "TH Köln",
        "city": "Cologne",
        "state": "North Rhine-Westphalia",
        "min_german_level": "B2",
        "min_english_level": "B2",
        "website_url": "https://www.th-koeln.de/",
        "description": (
            "One of Germany's largest universities of applied sciences. Broad catalogue covering "
            "informatics, architecture, and process engineering."
        ),
        "majors": ["Computer Science", "Architecture", "Civil Engineering", "Pharmaceutical and Chemical Engineering"],
    },
    {
        "name": "Hochschule Esslingen",
        "city": "Esslingen",
        "state": "Baden-Württemberg",
        "min_german_level": "B2",
        "min_english_level": "B1",
        "website_url": "https://www.hs-esslingen.de/",
        "description": (
            "Automotive and mechanical engineering powerhouse in the Stuttgart region. Excellent "
            "industry contacts with Daimler, Bosch, and Porsche suppliers."
        ),
        "majors": ["Mechanical Engineering", "Mechatronics Engineering", "Industrial Engineering", "Energy Engineering"],
    },
    {
        "name": "Hochschule Magdeburg-Stendal",
        "city": "Magdeburg",
        "state": "Saxony-Anhalt",
        "min_german_level": "B1",
        "min_english_level": "B2",
        "website_url": "https://www.h2.de/",
        "description": (
            "Close GJU partner with structured incoming support. Good fit for engineering, "
            "water, and industrial programmes with a lower cost of living."
        ),
        "majors": ["Industrial Engineering", "Water and Environmental Engineering", "Mechanical Engineering"],
    },
    {
        "name": "Hochschule Bonn-Rhein-Sieg",
        "city": "Sankt Augustin",
        "state": "North Rhine-Westphalia",
        "min_german_level": "B1",
        "min_english_level": "B2",
        "website_url": "https://www.h-brs.de/",
        "description": (
            "Applied informatics, cybersecurity, and business information systems near Bonn. "
            "English-taught modules are common in CS-related faculties."
        ),
        "majors": ["Computer Science", "Cyber Security", "Computer Engineering", "Management Sciences"],
    },
    {
        "name": "Hochschule Darmstadt",
        "city": "Darmstadt",
        "state": "Hesse",
        "min_german_level": "B2",
        "min_english_level": "B2",
        "website_url": "https://h-da.de/",
        "description": (
            "h_da is known for media, computer science, and electrical engineering. Darmstadt is "
            "a compact science city with strong public transport to Frankfurt."
        ),
        "majors": ["Computer Science", "Electrical Engineering", "Design and Visual Communication"],
    },
    {
        "name": "Hochschule Karlsruhe",
        "city": "Karlsruhe",
        "state": "Baden-Württemberg",
        "min_german_level": "B2",
        "min_english_level": "B2",
        "website_url": "https://www.h-ka.de/",
        "description": (
            "Engineering and informatics programmes in Germany's IT corridor. Suitable for "
            "computer engineering and mechatronics German Year placements."
        ),
        "majors": ["Computer Engineering", "Mechatronics Engineering", "Electrical Engineering"],
    },
    {
        "name": "Technische Hochschule Nürnberg",
        "city": "Nuremberg",
        "state": "Bavaria",
        "min_german_level": "B2",
        "min_english_level": "B1",
        "website_url": "https://www.th-nuernberg.de/",
        "description": (
            "TH Nürnberg Georg Simon Ohm offers practice-oriented engineering and business. "
            "Bavaria often expects solid B2 German for lectures and internships."
        ),
        "majors": ["Mechanical Engineering", "Industrial Engineering", "International Accounting"],
    },
    {
        "name": "Hochschule München",
        "city": "Munich",
        "state": "Bavaria",
        "min_german_level": "B2",
        "min_english_level": "B2",
        "website_url": "https://www.hm.edu/",
        "description": (
            "Germany's largest university of applied sciences. Competitive housing market; "
            "start visa and Sperrkonto early. Strong architecture and engineering faculties."
        ),
        "majors": ["Architecture", "Civil Engineering", "Mechanical Engineering", "Computer Science"],
    },
    {
        "name": "Hochschule RheinMain",
        "city": "Wiesbaden",
        "state": "Hesse",
        "min_german_level": "B1",
        "min_english_level": "B2",
        "website_url": "https://www.hs-rm.de/",
        "description": (
            "Campuses in Wiesbaden and Rüsselsheim. Logistics, architecture, and applied "
            "engineering with access to the Rhine-Main job market."
        ),
        "majors": ["Logistics Sciences", "Architecture", "Industrial Engineering"],
    },
    {
        "name": "Hochschule Heilbronn",
        "city": "Heilbronn",
        "state": "Baden-Württemberg",
        "min_german_level": "B1",
        "min_english_level": "B2",
        "website_url": "https://www.hs-heilbronn.de/",
        "description": (
            "Business, logistics, and mechatronics with a strong dual-study culture. "
            "Popular among GJU SBE and SATS students."
        ),
        "majors": ["Logistics Sciences", "Management Sciences", "Mechatronics Engineering"],
    },
    {
        "name": "Hochschule Offenburg",
        "city": "Offenburg",
        "state": "Baden-Württemberg",
        "min_german_level": "B1",
        "min_english_level": "B2",
        "website_url": "https://www.hs-offenburg.de/",
        "description": (
            "Energy, media, and mechanical programmes near the Black Forest and Strasbourg. "
            "Manageable city size for first-time German Year students."
        ),
        "majors": ["Energy Engineering", "Mechanical Engineering", "Computer Science"],
    },
    {
        "name": "Technische Universität Ilmenau",
        "city": "Ilmenau",
        "state": "Thuringia",
        "min_german_level": "B2",
        "min_english_level": "B2",
        "website_url": "https://www.tu-ilmenau.de/",
        "description": (
            "Research-oriented technical university. Biomedical and electrical engineering "
            "students often complete lab-heavy German Year modules here."
        ),
        "majors": ["Biomedical Engineering", "Electrical Engineering", "Computer Engineering"],
    },
    {
        "name": "Hochschule Bremen",
        "city": "Bremen",
        "state": "Bremen",
        "min_german_level": "B1",
        "min_english_level": "B2",
        "website_url": "https://www.hs-bremen.de/",
        "description": (
            "International faculty with English-friendly modules in some engineering tracks. "
            "Port city with lower rents than Munich or Berlin."
        ),
        "majors": ["Electrical Engineering", "Industrial Engineering", "Water and Environmental Engineering"],
    },
    {
        "name": "Hochschule für Technik Stuttgart",
        "city": "Stuttgart",
        "state": "Baden-Württemberg",
        "min_german_level": "B2",
        "min_english_level": "B2",
        "website_url": "https://www.hft-stuttgart.de/",
        "description": (
            "Architecture, civil engineering, and surveying in the heart of Baden-Württemberg's "
            "construction and mobility industries."
        ),
        "majors": ["Architecture", "Civil Engineering", "Design and Visual Communication"],
    },
    {
        "name": "Hochschule Anhalt",
        "city": "Köthen",
        "state": "Saxony-Anhalt",
        "min_german_level": "B1",
        "min_english_level": "B2",
        "website_url": "https://www.hs-anhalt.de/",
        "description": (
            "Design, architecture, and applied sciences campuses in Dessau, Köthen, and Bernburg. "
            "Bauhaus heritage makes it a strong SABE destination."
        ),
        "majors": ["Architecture", "Design and Visual Communication", "Pharmaceutical and Chemical Engineering"],
    },
    {
        "name": "Universität Leipzig",
        "city": "Leipzig",
        "state": "Saxony",
        "min_german_level": "TestDaF",
        "min_english_level": "B2",
        "website_url": "https://www.uni-leipzig.de/",
        "description": (
            "Traditional university partner for translation and humanities. TestDaF or Goethe C1 "
            "is typically expected for German-taught linguistics modules."
        ),
        "majors": ["Translation (German–English–Arabic)"],
    },
]

VISA_STEPS: list[dict] = [
    {
        "step_number": 1,
        "title": "Confirm GJU nomination and host admission",
        "description": (
            "Keep your IO nomination letter, Learning Agreement, and host university Zulassung "
            "or internship contract as PDFs. The German Embassy in Amman will ask for the original "
            "plus one copy of each."
        ),
        "category": "Documents",
        "recommended_weeks_before": 20,
    },
    {
        "step_number": 2,
        "title": "Open a blocked account (Sperrkonto)",
        "description": (
            "Open a Sperrkonto with a recognised provider (Expatrio, Fintiba, or Coracle). Deposit "
            "the current statutory annual amount published by the BAMF (check the latest figure; "
            "it is updated yearly). Transfer from a Jordanian bank early — SWIFT can take 3–7 days. "
            "Download the Sperrbestätigung for the embassy file."
        ),
        "category": "Sperrkonto",
        "recommended_weeks_before": 16,
    },
    {
        "step_number": 3,
        "title": "Buy incoming health insurance",
        "description": (
            "Purchase incoming travel health insurance that is valid from arrival until you can "
            "join German statutory insurance (often TK, AOK, or Barmer via a partner such as Mawista, "
            "DR-WALTER, or Expatrio). Coverage must include Germany for the full intended stay start."
        ),
        "category": "Health Insurance",
        "recommended_weeks_before": 12,
    },
    {
        "step_number": 4,
        "title": "Book the German Embassy Amman appointment",
        "description": (
            "Create an account on the German Embassy Amman / RK-Termin portal and book a national "
            "visa (D-visa) slot for study / Studienaufenthalt. Slots open in waves — monitor daily. "
            "Do not buy non-refundable flights before the visa is issued."
        ),
        "category": "Embassy Appointment",
        "recommended_weeks_before": 12,
    },
    {
        "step_number": 5,
        "title": "Prepare biometric photos and passport",
        "description": (
            "Passport must be valid at least 12 months beyond planned entry. Bring two recent "
            "biometric photos (35×45 mm, light background, ICAO/Schengen standard). Jordanian "
            "studios that specialise in Schengen photos are recommended."
        ),
        "category": "Documents",
        "recommended_weeks_before": 8,
    },
    {
        "step_number": 6,
        "title": "Compile language certificates",
        "description": (
            "Include GJU German transcripts plus Goethe-Zertifikat, ÖSD, or TestDaF as required "
            "by the host. Bring originals and copies. If you only have GJU internal B1, add a "
            "letter from the German Language Center explaining the track."
        ),
        "category": "Documents",
        "recommended_weeks_before": 8,
    },
    {
        "step_number": 7,
        "title": "Write the motivation letter and CV",
        "description": (
            "German-language Motivationsschreiben (1–2 pages) explaining the German Year purpose, "
            "host university, and return to GJU. Attach a signed tabular Lebenslauf. Keep copies "
            "in English if the officer requests clarification."
        ),
        "category": "Documents",
        "recommended_weeks_before": 6,
    },
    {
        "step_number": 8,
        "title": "Proof of accommodation and travel plan",
        "description": (
            "Studentenwohnheim reservation, WG contract, or host confirmation is ideal. If pending, "
            "include temporary booking plus a written plan. Print a tentative itinerary — tickets "
            "should remain changeable."
        ),
        "category": "Documents",
        "recommended_weeks_before": 5,
    },
    {
        "step_number": 9,
        "title": "Visa fee, forms, and embassy checklist",
        "description": (
            "Complete the national visa application form, VIDEX printout if used, and the embassy "
            "document checklist. Pay the visa fee in the currency/method stated on the Amman embassy "
            "website (often JOD equivalent of EUR 75). Bring a folder with originals in front and copies behind."
        ),
        "category": "Embassy Appointment",
        "recommended_weeks_before": 2,
    },
    {
        "step_number": 10,
        "title": "Attend the embassy interview and biometrics",
        "description": (
            "Arrive early at the German Embassy in Abdoun, Amman. Fingerprints and a short interview "
            "in German or English are typical. Processing can take several weeks — keep IO and host "
            "informed. Collect the passport only when notified."
        ),
        "category": "Embassy Appointment",
        "recommended_weeks_before": 1,
    },
]


def seed() -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if db.scalar(select(Major.id).limit(1)):
            print("Database already seeded. Delete rows or drop tables to re-seed.")
            return

        majors_by_name: dict[str, Major] = {}
        for row in MAJORS:
            major = Major(name=row["name"], school=row["school"])
            db.add(major)
            majors_by_name[row["name"]] = major
        db.flush()

        for row in UNIVERSITIES:
            uni = University(
                name=row["name"],
                city=row["city"],
                state=row["state"],
                min_german_level=row["min_german_level"],
                min_english_level=row["min_english_level"],
                website_url=row["website_url"],
                description=row["description"],
            )
            uni.majors = [majors_by_name[name] for name in row["majors"]]
            db.add(uni)

        for row in VISA_STEPS:
            db.add(VisaStep(**row))

        db.commit()
        print(f"Seeded {len(MAJORS)} majors, {len(UNIVERSITIES)} universities, {len(VISA_STEPS)} visa steps.")
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
