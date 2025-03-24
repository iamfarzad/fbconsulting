from fastapi import APIRouter, Request, HTTPException
from typing import Optional, List
from pydantic import BaseModel
from resend import Resend
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Resend
resend = Resend(api_key=os.getenv("RESEND_API_KEY"))

router = APIRouter()

class PricingItem(BaseModel):
    service: str
    price: float
    description: str

class ProposalData(BaseModel):
    summary: List[str]
    pricing: List[PricingItem]
    recommendations: List[str]

class UserInfo(BaseModel):
    name: str
    email: str

class GeminiState(BaseModel):
    messages: List[dict]
    userInfo: UserInfo
    step: str
    proposal: Optional[ProposalData]

@router.post("/api/proposals/send")
async def send_proposal(request: Request):
    try:
        data = await request.json()
        state = GeminiState(**data)

        if not state.userInfo or not state.userInfo.email or not state.userInfo.name:
            raise HTTPException(status_code=400, detail="Missing user information")

        if not state.proposal:
            raise HTTPException(status_code=400, detail="Missing proposal data")

        # Generate proposal ID
        from random import randint
        proposal_id = hex(randint(0, 16**8))[2:]

        # Format proposal content
        proposal_content = f"""
        <h2>Proposal Summary</h2>
        <p><strong>For:</strong> {state.userInfo.name}</p>
        
        <h3>Summary Points</h3>
        <ul>
            {"".join([f"<li>{point}</li>" for point in state.proposal.summary])}
        </ul>

        <h3>Recommended Services</h3>
        <table>
            <tr>
                <th>Service</th>
                <th>Price</th>
                <th>Description</th>
            </tr>
            {"".join([
                f"<tr><td>{item.service}</td><td>${item.price}</td><td>{item.description}</td></tr>"
                for item in state.proposal.pricing
            ])}
        </table>

        <h3>Recommendations</h3>
        <ul>
            {"".join([f"<li>{rec}</li>" for rec in state.proposal.recommendations])}
        </ul>
        """

        # Send email using Resend
        email = resend.emails.send({
            "from": "FB Consulting <proposals@fbconsulting.com>",
            "to": [state.userInfo.email],
            "subject": f"Your Proposal from FB Consulting - {proposal_id}",
            "html": proposal_content
        })

        # Log success for monitoring
        print("Proposal sent:", {
            "proposalId": proposal_id,
            "emailId": email["id"],
            "userInfo": state.userInfo,
            "messageCount": len(state.messages)
        })

        return {
            "success": True,
            "proposalId": proposal_id,
            "emailId": email["id"],
            "message": "Proposal sent successfully via email"
        }

    except Exception as e:
        print("Error sending proposal:", str(e))
        raise HTTPException(status_code=500, detail=str(e))
