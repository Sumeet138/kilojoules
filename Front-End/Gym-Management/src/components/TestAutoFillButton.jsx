import { Button } from "@material-tailwind/react";

const TEST_DATA = {
  member: {
    memberId: "MEM001",
    username: "arjun_sharma",
    password: "Demo@1234",
    email: "arjun.sharma@demo.com",
    firstName: "Arjun",
    lastName: "Sharma",
    phone: "9876543210",
    dob: "1998-03-12",
    age: "26",
    gender: "MALE",
    heightCm: "175",
    weightKg: "72",
    healthConditions: "None",
    fitnessGoals: "Weight loss and muscle gain",
    trainerPreference: "Male trainer",
  },
  admin: {
    adminId: "ADM001",
    username: "vikram_admin",
    password: "Demo@1234",
    email: "vikram.admin@demo.com",
    firstName: "Vikram",
    lastName: "Mehta",
    phone: "9123456789",
  },
  trainer: {
    trainerId: "TRN001",
    username: "priya_trainer",
    password: "Demo@1234",
    email: "priya.trainer@demo.com",
    firstName: "Priya",
    lastName: "Nair",
    phone: "9988776655",
    specialization: "Yoga, Zumba, Strength Training",
    certificationLevel: "ACE Certified Personal Trainer",
    bio: "Certified trainer with 6+ years of experience in yoga, zumba and strength training.",
  },
};

export function MemberAutoFillButton({ onFill }) {
  const handleFill = () => {
    onFill(TEST_DATA.member);
  };

  return (
    <Button
      type="button"
      onClick={handleFill}
      variant="outlined"
      size="sm"
      className="text-xs border-gym-warm text-gym-warm hover:bg-gym-warm hover:text-white"
    >
      ⚡ Auto-Fill Test Data
    </Button>
  );
}

export function AdminAutoFillButton({ onFill }) {
  const handleFill = () => {
    onFill(TEST_DATA.admin);
  };

  return (
    <Button
      type="button"
      onClick={handleFill}
      variant="outlined"
      size="sm"
      className="text-xs border-gym-charcoal text-gym-charcoal hover:bg-gym-charcoal hover:text-white"
    >
      ⚡ Auto-Fill Test Data
    </Button>
  );
}

export function TrainerAutoFillButton({ onFill }) {
  const handleFill = () => {
    onFill(TEST_DATA.trainer);
  };

  return (
    <Button
      type="button"
      onClick={handleFill}
      variant="outlined"
      size="sm"
      className="text-xs border-gym-brown text-gym-brown hover:bg-gym-brown hover:text-white"
    >
      ⚡ Auto-Fill Test Data
    </Button>
  );
}

export function SignInAutoFillButton({ onFill, onQuickLogin, role = "member" }) {
  const testData = TEST_DATA[role];
  const creds = { username: testData.username, password: testData.password };

  const colorMap = {
    member:  "border-gym-warm text-gym-warm hover:bg-gym-warm hover:text-white",
    trainer: "border-gym-brown text-gym-brown hover:bg-gym-brown hover:text-white",
    admin:   "border-gym-charcoal text-gym-charcoal hover:bg-gym-charcoal hover:text-white",
  };
  const quickColorMap = {
    member:  "bg-gym-warm text-white hover:opacity-90",
    trainer: "bg-gym-brown text-white hover:opacity-90",
    admin:   "bg-gym-charcoal text-white hover:opacity-90",
  };

  return (
    <div className="flex gap-2 items-center">
      <Button
        type="button"
        onClick={() => onFill(creds)}
        variant="outlined"
        size="sm"
        className={`text-xs ${colorMap[role] || colorMap.member}`}
      >
        ✏️ Fill Credentials
      </Button>
      {onQuickLogin && (
        <Button
          type="button"
          onClick={() => onQuickLogin(creds)}
          size="sm"
          className={`text-xs ${quickColorMap[role] || quickColorMap.member}`}
        >
          Quick Login
        </Button>
      )}
    </div>
  );
}

export function ForgotPasswordAutoFillButton({ onFill }) {
  const handleFill = () => {
    onFill("john.member@test.com");
  };

  return (
    <Button
      type="button"
      onClick={handleFill}
      variant="outlined"
      size="sm"
      className="text-xs border-gym-warm text-gym-warm hover:bg-gym-warm hover:text-white"
    >
      ⚡ Auto-Fill Test Email
    </Button>
  );
}
