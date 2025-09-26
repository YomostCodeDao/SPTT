import { Button } from "@/components/ui/button";
import { clearToken } from "@/lib/auth";
import { Link, useNavigate } from "react-router-dom";

export default function TopBar() {
    const nav = useNavigate();
    return (
        <div className="flex items-center justify-between py-4">
            <div>
                <h1 className="text-xl font-semibold">Learn English <span className="text-xs ml-2 px-2 py-0.5 border rounded-full border-neutral-700 text-neutral-300">Upload MP3</span></h1>
                <p className="text-sm text-neutral-400">Listen sentence by sentence, type it back, AI checks & highlights mistakes.</p>
            </div>
            <div className="flex items-center gap-2">
                <Link to="/profile" className="text-sm text-neutral-300 hover:underline">Profile</Link>
                <Button
                    variant="inverted"
                    onClick={() => { clearToken(); nav("/login", { replace: true }); }}
                >
                    Log out
                </Button>

            </div>
        </div>
    );
}
