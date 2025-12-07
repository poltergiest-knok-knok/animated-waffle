import React from "react";
import styled, { keyframes } from "styled-components";
import GlassButton from "./Shared/GlassButton";
import SEO from "./Shared/SEO";

// --- Icons ---

const WhatsAppIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.472 14.382C17.175 14.233 15.714 13.515 15.442 13.415C15.169 13.316 14.971 13.267 14.772 13.565C14.575 13.862 14.005 14.531 13.832 14.729C13.659 14.928 13.485 14.952 13.188 14.804C12.891 14.654 11.933 14.341 10.798 13.329C9.915 12.541 9.318 11.568 9.145 11.27C8.972 10.973 9.127 10.812 9.275 10.664C9.409 10.531 9.573 10.317 9.721 10.144C9.87 9.97 9.953 9.846 10.052 9.648C10.151 9.499 10.094 9.325 10.007 9.152C9.92 8.979 9.24 7.256 8.957 6.555C8.678 5.864 8.393 5.957 8.19 5.946C7.994 5.935 7.771 5.935 7.548 5.935C7.325 5.935 6.963 6.019 6.658 6.353C6.352 6.687 5.488 7.497 5.488 9.146C5.488 10.795 6.688 12.389 6.855 12.613C7.022 12.837 9.215 16.218 12.572 17.666C15.362 18.869 15.932 18.716 16.546 18.651C17.454 18.555 18.494 17.855 18.768 17.087C19.041 16.319 19.041 15.661 18.959 15.523C18.877 15.385 18.679 15.3 18.382 15.151H17.472ZM12.041 21.78C10.258 21.78 8.601 21.326 7.159 20.531L6.855 20.353L3.109 21.341L4.12 17.765L3.923 17.437C3.064 16.035 2.613 14.414 2.613 12.723C2.613 7.575 6.842 3.386 12.047 3.386C14.564 3.386 16.931 4.364 18.708 6.136C20.485 7.908 21.463 10.27 21.463 12.784C21.463 17.935 17.236 22.124 12.042 21.78H12.041Z" />
    </svg>
);

const DiscordIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419z" />
    </svg>
);

const EmailIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
        <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
);

const XIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-8.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

const InstagramIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
);

const YouTubeIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
);


// --- Styled Components ---

const ContactRoot = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: #000;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  overflow: hidden;
  position: relative;
  padding: 4rem 1rem;
`;

const BackgroundGradient = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 50% 50%, rgba(20, 20, 20, 0.8) 0%, #000 100%);
  z-index: 0;
`;

const ContentContainer = styled.div`
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3rem;
  width: 100%;
  max-width: 1200px;
`;

const Title = styled.h1`
  font-size: 3.5rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.2rem;
  margin-bottom: 0.5rem;
  background: linear-gradient(120deg, #fff 0%, rgba(255, 255, 255, 0.5) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  width: 100%;
  justify-content: center;
  perspective: 1000px;
`;

const ContactCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1.5rem;
  transition: all 0.4s ease;
  min-height: 200px;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-10px) scale(1.02);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6), inset 0 0 20px rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.3);
    background: rgba(255, 255, 255, 0.05);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transition: 0.5s;
  }

  &:hover::before {
    left: 100%;
  }
`;

const Label = styled.div`
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
  letter-spacing: 0.1rem;
  font-weight: 600;
`;

const Value = styled.div`
  font-size: 1.25rem;
  color: #fff;
  font-weight: 500;
  margin-top: 0.5rem;
  word-break: break-all;
`;

const LinkButton = styled.a`
  margin-top: auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.8rem 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #fff;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
  width: 100%;
  border: 1px solid transparent;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.5);
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.1);
  }
`;

const SocialSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  width: 100%;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 1rem;
`;

const SocialTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.15rem;
  color: rgba(255, 255, 255, 0.8);
`;

const SocialDock = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(12px);
  border-radius: 50px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
`;

const SocialLink = styled.a`
  color: rgba(255, 255, 255, 0.7);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  padding: 0.8rem 1.5rem;
  border-radius: 50px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.05);
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;

  &:hover {
    color: #fff;
    transform: translateY(-5px);
    background: ${props => props.$color || 'rgba(255, 255, 255, 0.2)'};
    box-shadow: 0 0 20px ${props => props.$color ? props.$color : 'rgba(255, 255, 255, 0.3)'};
    border-color: rgba(255, 255, 255, 0.2);
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

// --- Component ---

export default function Contact() {
    return (
        <ContactRoot>
            <SEO
                title="UnmuteXE - Contact"
                description="Get in touch with UnmuteXE for collaborations on Web Development, Video Editing, or Graphic Design."
            />
            <BackgroundGradient />
            <ContentContainer>
                <Title>Get In Touch</Title>

                <CardsGrid>
                    {/* WhatsApp */}
                    <ContactCard>
                        <div>
                            <Label>Platform</Label>
                            <Value style={{ color: '#25D366', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <WhatsAppIcon />
                                WhatsApp
                            </Value>
                        </div>
                        <LinkButton href="https://wa.me/918434029444" target="_blank" rel="noopener noreferrer">
                            Chat Now
                        </LinkButton>
                    </ContactCard>

                    {/* WhatsApp 2 */}
                    <ContactCard>
                        <div>
                            <Label>Platform</Label>
                            <Value style={{ color: '#25D366', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <WhatsAppIcon />
                                WhatsApp
                            </Value>
                        </div>
                        <LinkButton href="https://wa.me/917250704355" target="_blank" rel="noopener noreferrer">
                            Chat Now
                        </LinkButton>
                    </ContactCard>

                    {/* Email */}
                    <ContactCard>
                        <div>
                            <Label>Direct Contact</Label>
                            <Value style={{ color: '#007AFF', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <EmailIcon />
                                Email
                            </Value>
                        </div>
                        <LinkButton href="mailto:roshankishorekka@icloud.com">
                            Send Email
                        </LinkButton>
                    </ContactCard>

                    {/* Discord - vynce.visuals */}
                    <ContactCard>
                        <div>
                            <Label>Discord</Label>
                            <Value style={{ color: '#5865F2', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <DiscordIcon />
                                vynce.visuals
                            </Value>
                        </div>
                        <LinkButton href="https://discordapp.com/users/889823271720189952" target="_blank" rel="noopener noreferrer">
                            View Profile
                        </LinkButton>
                    </ContactCard>

                    {/* Discord - .punisheroflife */}
                    <ContactCard>
                        <div>
                            <Label>Discord</Label>
                            <Value style={{ color: '#5865F2', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <DiscordIcon />
                                .punisheroflife
                            </Value>
                        </div>
                        <LinkButton href="https://discordapp.com/users/488258423906107392" target="_blank" rel="noopener noreferrer">
                            View Profile
                        </LinkButton>
                    </ContactCard>
                </CardsGrid>

                <SocialSection>
                    <SocialTitle>Socials</SocialTitle>
                    <SocialDock>
                        {/* Vynce Visuals Instagram */}
                        <SocialLink
                            href="https://www.instagram.com/vynce.visuals"
                            target="_blank"
                            rel="noopener noreferrer"
                            $color="rgba(225, 48, 108, 0.4)"
                        >
                            <InstagramIcon />
                            vynce.visuals
                        </SocialLink>

                        {/* X / Twitter */}
                        <SocialLink
                            href="https://x.com/Vynce_Visuals"
                            target="_blank"
                            rel="noopener noreferrer"
                            $color="rgba(255, 255, 255, 0.2)"
                        >
                            <XIcon />
                            @Vynce_Visuals
                        </SocialLink>

                        {/* YT Jobs */}
                        <SocialLink
                            href="https://ytjobs.co/talent/vitrine/446014"
                            target="_blank"
                            rel="noopener noreferrer"
                            $color="rgba(255, 0, 0, 0.4)"
                        >
                            <YouTubeIcon />
                            YT Jobs
                        </SocialLink>

                        {/* Personal Instagram */}
                        <SocialLink
                            href="https://www.instagram.com/incorrigible_roshan/"
                            target="_blank"
                            rel="noopener noreferrer"
                            $color="rgba(225, 48, 108, 0.4)"
                        >
                            <InstagramIcon />
                            incorrigible_roshan
                        </SocialLink>

                        {/* Murmu Instagram */}
                        <SocialLink
                            href="https://www.instagram.com/murmu_083/"
                            target="_blank"
                            rel="noopener noreferrer"
                            $color="rgba(225, 48, 108, 0.4)"
                        >
                            <InstagramIcon />
                            murmu_083
                        </SocialLink>
                    </SocialDock>
                </SocialSection>


                {/* Home Button */}
                <div style={{ marginTop: '1rem' }}>
                    <GlassButton onClick={() => window.location.href = '/'}>
                        Back Home
                    </GlassButton>
                </div>
            </ContentContainer>
        </ContactRoot>
    );
}
