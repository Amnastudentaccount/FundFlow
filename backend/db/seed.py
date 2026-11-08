from sqlmodel import Session, select
from db.session import engine
from db.models import Member, Pool

def seed_db():
    with Session(engine) as session:
        # Check karo agar data pehle se hai
        pool = session.exec(select(Pool)).first()
        if not pool:
            # Default Pool banayein
            new_pool = Pool()
            session.add(new_pool)
            
            # Rahman Family Members
            members = [
                Member(name="Ayesha", role="OWNER", paypal_email="ayesha@example.com"),
                Member(name="Bilal", role="APPROVER", paypal_email="bilal@example.com"),
                Member(name="Sara", role="CONTRIBUTOR", paypal_email="sara@example.com"),
            ]
            for m in members:
                session.add(m)
            
            session.commit()
            print("✅ Database seeded successfully!")