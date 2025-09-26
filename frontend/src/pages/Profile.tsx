import { Button } from "@/components/ui/button";
import { clearToken } from "@/lib/auth";
import { useNavigate, Link } from "react-router-dom";

export default function Profile() {
    const nav = useNavigate();
    return (
        <div className="min-h-screen bg-black text-neutral-100 grid place-items-center p-6">
            <div className="w-full max-w-lg rounded-xl border border-neutral-800 bg-neutral-950 p-6">
                <h1 className="text-xl font-semibold">Profile</h1>
                <p className="text-neutral-400 text-sm mt-1">Your account & settings.</p>
                <div className="mt-4 flex items-center gap-2">
                    <Link to="/practice" className="text-sm text-neutral-300 hover:underline">Back to Practice</Link>
                    <Button
                        variant="inverted"
                        onClick={() => { clearToken(); nav("/login", { replace: true }); }}
                    >
                        Log out
                    </Button>

                </div>
            </div>
        </div>
    );
}
