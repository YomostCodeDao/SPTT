import * as React from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { saveToken } from "@/lib/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const nav = useNavigate();
    const [email, setEmail] = React.useState("");
    const [pwd, setPwd] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [err, setErr] = React.useState("");

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!email || !pwd) return setErr("Please enter email and password.");
        try {
            setLoading(true);
            setErr("");

            // TODO: gọi real backend login
            // const res = await fetch("/auth/login", { method: "POST", ... })
            // const { token } = await res.json()
            const token = "demo-token"; // giả lập
            saveToken(token);

            // 🚀 Sau login → điều hướng sang Placement Test
            nav("/placement-test", { replace: true });
        } catch {
            setErr("Login failed. Try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-black text-neutral-100 grid place-items-center p-6">
            <Card className="w-full max-w-md">
                <div className="mb-6">
                    <h1 className="text-lg font-semibold">Login to your account</h1>
                    <p className="text-sm text-neutral-400 mt-1">
                        Enter your email below to login to your account
                    </p>
                </div>

                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="me@example.com"
                        />
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">Password</Label>
                            <a
                                href="#"
                                className="text-xs text-neutral-400 hover:text-neutral-200"
                            >
                                Forgot your password?
                            </a>
                        </div>
                        <Input
                            id="password"
                            type="password"
                            value={pwd}
                            onChange={(e) => setPwd(e.target.value)}
                        />
                    </div>

                    {err && <p className="text-sm text-red-400">{err}</p>}

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </Button>

                    <Button variant="inverted" className="w-full font-medium">
                        Login with Google
                    </Button>
                </form>
            </Card>
        </div>
    );
}
