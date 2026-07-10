import { Link } from 'react-router-dom'
import { Heart, Mail } from 'lucide-react'
import { openCookieSettings } from '@/utils/consent'

export const Footer = () => {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="mt-20 glass-effect border-t border-white/20 dark:border-slate-700/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Brand */}
                    <div>
                        <h3 className="text-xl font-bold gradient-text mb-4">BagoTech</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            Descubre los mejores productos en Amazon con ofertas exclusivas y recomendaciones
                            curadas.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Enlaces</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    to="/"
                                    className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm transition-colors"
                                >
                                    Inicio
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/productos"
                                    className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm transition-colors"
                                >
                                    Productos
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/legal"
                                    className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm transition-colors"
                                >
                                    Aviso Legal
                                </Link>
                            </li>
                            <li>
                                <button
                                    onClick={openCookieSettings}
                                    className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm transition-colors"
                                >
                                    Configurar cookies
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Contacto</h4>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
                            <Mail className="w-4 h-4" />
                            <span>info@bagotech.com</span>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8">
                    {/* Amazon Affiliate Disclaimer */}
                    <div className="mb-6 p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                        <p className="text-xs text-amber-800 dark:text-amber-200">
                            <strong>Aviso de Afiliado:</strong> BagoTech participa en el Programa de Afiliados
                            de Amazon EU, un programa de publicidad para afiliados diseñado para ofrecer a sitios
                            web un modo de obtener comisiones por publicidad, publicitando e incluyendo enlaces a
                            Amazon.es. Como Afiliado de Amazon, obtengo ingresos por las compras adscritas que
                            cumplen los requisitos aplicables.
                        </p>
                    </div>

                    {/* Copyright */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            © {currentYear} BagoTech. Todos los derechos reservados.
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                            Hecho con <Heart className="w-4 h-4 text-red-500 fill-red-500" /> para compradores
                            inteligentes
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    )
}
