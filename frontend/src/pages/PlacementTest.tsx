// frontend/src/pages/PlacementTest.tsx
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

interface TestAudio {
    level: string;
    file: string;
    audio_url: string;
}

interface SubmitResult {
    file: string;
    user_answer: string;
    correct_answer: string;
    score: number;
    suggested_level: string;
}

const API_URL = "http://127.0.0.1:3000";

const PlacementTest: React.FC = () => {
    const [test, setTest] = useState<TestAudio | null>(null);
    const [answer, setAnswer] = useState("");
    const [result, setResult] = useState<SubmitResult | null>(null);
    const [loading, setLoading] = useState(false);
    const nav = useNavigate();

    // Lấy test khi load trang
    useEffect(() => {
        fetch(`${API_URL}/api/placement/random`)
            .then((res) => res.json())
            .then((data) => setTest(data))
            .catch((err) => console.error("Error fetching test:", err));
    }, []);

    const handleSubmit = async () => {
        if (!test) return;
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/placement/submit`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    level: test.level,
                    file: test.file,
                    user_answer: answer,
                }),
            });
            if (!res.ok) throw new Error("Submit failed");
            const data = await res.json();
            setResult(data);
        } catch (e) {
            alert("Có lỗi khi nộp bài test!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-neutral-100 grid place-items-center p-6">
            <Card className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-lg">
                <h1 className="text-xl font-semibold text-center text-neutral-100 mb-4">
                    Placement Test 
                </h1>

                {!result && test && (
                    <>
                        <p className="text-neutral-400 text-sm mb-2">
                            Nghe đoạn audio dưới đây và nhập lại nội dung bạn nghe được.
                        </p>
                        <audio
                            className="w-full my-3"
                            src={`${API_URL}${test.audio_url}`}
                            controls
                        />

                        <Input
                            type="text"
                            placeholder="Nhập nội dung bạn nghe..."
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            className="mt-3 bg-neutral-800 border-neutral-700 text-neutral-100"
                        />

                        <Button
                            onClick={handleSubmit}
                            disabled={loading || !answer}
                            className="w-full mt-4 bg-white text-black font-semibold hover:bg-neutral-200 rounded-lg py-2"
                        >
                            {loading ? "Đang chấm..." : "Nộp bài"}
                        </Button>
                    </>
                )}

                {result && (
                    <div className="mt-6 text-center space-y-3">
                        <h2 className="text-lg font-semibold text-green-400">
                            Kết quả bài test
                        </h2>
                        <p className="text-neutral-300">
                            <strong>Đáp án chuẩn:</strong> {result.correct_answer}
                        </p>
                        <p className="text-neutral-300">
                            <strong>Bạn nhập:</strong> {result.user_answer}
                        </p>
                        <p className="text-white font-bold">
                            Điểm: {result.score}%
                        </p>
                        <p className="text-indigo-400 font-bold text-lg">
                            Gợi ý Level: {result.suggested_level}
                        </p>

                        <Button
                            onClick={() => window.location.reload()}
                            className="mt-4 w-full bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg"
                        >
                            Làm lại bài test khác
                        </Button>

                        <Button
                            onClick={() => nav("/practice")}
                            className="mt-2 w-full bg-white text-black hover:bg-neutral-200 font-semibold rounded-lg"
                        >
                            Vào luyện tập ngay
                        </Button>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default PlacementTest;
