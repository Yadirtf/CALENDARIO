'use client';

import React from 'react';
import { Building2, MapPin, Phone, Mail, Globe, Edit, Trash2 } from 'lucide-react';
import { Company } from '@/lib/types';
import Button from '@/components/ui/Button';

interface CompanyListProps {
    companies: Company[];
    onEdit: (company: Company) => void;
    onDelete: (id: string) => void;
}

const CompanyList: React.FC<CompanyListProps> = ({ companies, onEdit, onDelete }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {companies.map((company) => (
                <div
                    key={company._id}
                    className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow"
                >
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3 flex-1">
                            {company.logo ? (
                                <img
                                    src={company.logo}
                                    alt={company.name}
                                    className="w-12 h-12 rounded-lg object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                />
                            ) : (
                                <div className="w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                                    <Building2 className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                                    {company.name}
                                </h3>
                                {company.nit && (
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        NIT: {company.nit}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => onEdit(company)}
                                className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                title="Editar"
                            >
                                <Edit size={16} />
                            </button>
                            <button
                                onClick={() => onDelete(company._id!)}
                                className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                title="Eliminar"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2 text-sm">
                        {company.country && (
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                <MapPin size={14} />
                                <span>{company.country}</span>
                            </div>
                        )}
                        {company.phone && (
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                <Phone size={14} />
                                <span>{company.phone}</span>
                            </div>
                        )}
                        {company.email && (
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                <Mail size={14} />
                                <span className="truncate">{company.email}</span>
                            </div>
                        )}
                        {company.website && (
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                <Globe size={14} />
                                <a
                                    href={company.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary-600 dark:text-primary-400 hover:underline truncate"
                                >
                                    {company.website}
                                </a>
                            </div>
                        )}
                        {company.address && (
                            <div className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                                <MapPin size={14} className="mt-0.5" />
                                <span className="line-clamp-2">{company.address}</span>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CompanyList;

