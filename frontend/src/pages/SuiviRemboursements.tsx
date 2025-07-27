import { Link } from "react-router-dom";
import {
    ArrowLeft,
    Search,
    Filter,
    CheckCircle,
    Clock,
    XCircle,
    Euro,
    Calendar,
    Receipt,
    Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

const SuiviRemboursements = () => {
    const [statusFilter, setStatusFilter] = useState("all");
    const reimbursements = [
        {
            id: "RB001",
            mission: "Formation Paris",
            date: "15/01/2024",
            amount: 245.50,
            status: "approved",
            submittedDate: "10/01/2024",
            type: "Transport + Hébergement"
        },
        {
            id: "RB002",
            mission: "Réunion Lyon",
            date: "08/01/2024",
            amount: 89.30,
            status: "pending",
            submittedDate: "12/01/2024",
            type: "Repas"
        },
        {
            id: "RB003",
            mission: "Conférence Bordeaux",
            date: "20/12/2023",
            amount: 320.75,
            status: "paid",
            submittedDate: "22/12/2023",
            type: "Transport + Repas"
        },
        {
            id: "RB004",
            mission: "Formation Toulouse",
            date: "15/12/2023",
            amount: 156.20,
            status: "rejected",
            submittedDate: "18/12/2023",
            type: "Hébergement"
        }
    ];

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "approved":
                return <Badge className="bg-green-100 text-green-800 hover:bg-green-100"><CheckCircle className="w-3 h-3 mr-1" />Validé</Badge>;
            case "pending":
                return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100"><Clock className="w-3 h-3 mr-1" />En attente</Badge>;
            case "paid":
                return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100"><Euro className="w-3 h-3 mr-1" />Payé</Badge>;
            case "rejected":
                return <Badge className="bg-red-100 text-red-800 hover:bg-red-100"><XCircle className="w-3 h-3 mr-1" />Refusé</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const totalPending = reimbursements
        .filter(r => r.status === "pending" || r.status === "approved")
        .reduce((sum, r) => sum + r.amount, 0);

    const totalPaid = reimbursements
        .filter(r => r.status === "paid")
        .reduce((sum, r) => sum + r.amount, 0);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
            {/* Header */}
            <header className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Link to="/frontoffice/dashboard" className="text-[#cccc00] hover:text-[#ffff00]">
                                <ArrowLeft className="w-6 h-6" />
                            </Link>
                            <div>
                                <h1 className="text-2xl font-bold text-white">Suivi des remboursements</h1>
                                <p className="text-gray-300">Suivez l'état de vos demandes de remboursement</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                {/* Summary Cards */}
                <div className="grid md:grid-cols-4 gap-6 mb-8">
                    <Card className="bg-gradient-to-br from-[#cccc00] to-[#ffff00] text-black border-0">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm">Total demandes</p>
                                    <p className="text-3xl">{reimbursements.length}</p>
                                </div>
                                <Receipt className="w-8 h-8" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white border-">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-orange-100 text-sm">En cours</p>
                                    <p className="text-3xl font-bold">{totalPending.toFixed(2)}€</p>
                                </div>
                                <Clock className="w-8 h-8 text-orange-200" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-500 to-emerald-500 text-white border-0">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-green-100 text-sm">Remboursés</p>
                                    <p className="text-3xl font-bold">{totalPaid.toFixed(2)}€</p>
                                </div>
                                <CheckCircle className="w-8 h-8 text-green-200" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white border-0">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-green-100 text-sm">Remboursés</p>
                                    <p className="text-3xl font-bold">{totalPaid.toFixed(2)}€</p>
                                </div>
                                <CheckCircle className="w-8 h-8 text-green-200" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters and Search */}
                <Card className="hover:shadow-lg transition-shadow bg-gray-900/90 border-gray-700 mb-6">
                    <CardHeader>
                        <CardTitle className="text-white">Rechercher et filtrer</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <Input
                                        placeholder="Rechercher par mission, référence..."
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <div className="w-full md:w-48">
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                                        <Filter className="w-4 h-4 mr-2" />
                                        <SelectValue placeholder="Filtrer par statut" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tous les statuts</SelectItem>
                                        <SelectItem value="En attente">En attente</SelectItem>
                                        <SelectItem value="Validée">Validée</SelectItem>
                                        <SelectItem value="Refusée">Refusée</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Reimbursements Table */}
                <Card className="hover:shadow-lg transition-shadow bg-gray-900/90 border-gray-700">
                    <CardHeader>
                        <CardTitle className="text-white">Historique des remboursements</CardTitle>
                        <CardDescription className="text-gray-300">
                            Liste complète de vos demandes de remboursement
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Référence</TableHead>
                                    <TableHead>Mission</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Date mission</TableHead>
                                    <TableHead>Montant</TableHead>
                                    <TableHead>Statut</TableHead>
                                    <TableHead>Date soumission</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {reimbursements.map((reimbursement) => (
                                    <TableRow key={reimbursement.id}>
                                        <TableCell className="font-medium">{reimbursement.id}</TableCell>
                                        <TableCell>{reimbursement.mission}</TableCell>
                                        <TableCell>{reimbursement.type}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center text-gray-300">
                                                <Calendar className="w-4 h-4 mr-1" />
                                                {reimbursement.date}
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-semibold text-white">{reimbursement.amount.toFixed(2)}€</TableCell>
                                        <TableCell>{getStatusBadge(reimbursement.status)}</TableCell>
                                        <TableCell className="text-gray-300">{reimbursement.submittedDate}</TableCell>

                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default SuiviRemboursements;