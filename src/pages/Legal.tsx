import { Card } from '@/components/ui/Card'
import { Shield, FileText, Cookie } from 'lucide-react'
import { SEO } from '@/components/SEO'

export const Legal = () => {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <SEO
                title="Información Legal"
                description="Aviso de afiliado, política de privacidad y política de cookies de BagoTech."
                canonical="/legal"
                noindex
            />
            <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    Información Legal
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Transparencia y cumplimiento legal
                </p>
            </div>

            {/* Amazon Affiliate Disclosure */}
            <Card glass>
                <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                        <Shield className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Programa de Afiliados de Amazon
                        </h2>
                        <div className="prose dark:prose-invert max-w-none">
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                BagoTech participa en el Programa de Afiliados de Amazon EU, un programa de
                                publicidad para afiliados diseñado para ofrecer a sitios web un modo de obtener
                                comisiones por publicidad, publicitando e incluyendo enlaces a Amazon.es.
                            </p>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                Como Afiliado de Amazon, obtengo ingresos por las compras adscritas que cumplen
                                los requisitos aplicables. Esto significa que cuando haces clic en un enlace de
                                producto y realizas una compra en Amazon, podemos recibir una pequeña comisión sin
                                costo adicional para ti.
                            </p>
                            <p className="text-gray-700 dark:text-gray-300">
                                <strong>Importante:</strong> Los precios y la disponibilidad de los productos son
                                exactos a la fecha/hora indicada y están sujetos a cambios. Cualquier información
                                de precio y disponibilidad que se muestre en Amazon.es en el momento de la compra
                                se aplicará a la compra de este producto.
                            </p>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Privacy Policy */}
            <Card glass>
                <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                        <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Política de Privacidad
                        </h2>
                        <div className="prose dark:prose-invert max-w-none">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                Recopilación de Datos
                            </h3>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                BagoTech no recopila datos personales de los usuarios. No solicitamos ni
                                almacenamos información como nombres, direcciones de correo electrónico o datos de
                                pago.
                            </p>

                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                Cookies y Análisis
                            </h3>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                Utilizamos Google Analytics para comprender cómo los visitantes interactúan con
                                nuestro sitio. Esta herramienta utiliza cookies para recopilar información
                                anónima sobre el uso del sitio, como páginas visitadas y tiempo de permanencia.
                            </p>

                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                Enlaces a Terceros
                            </h3>
                            <p className="text-gray-700 dark:text-gray-300">
                                Nuestro sitio contiene enlaces a Amazon.es. Una vez que hagas clic en estos
                                enlaces y salgas de nuestro sitio, estarás sujeto a las políticas de privacidad
                                de Amazon. No tenemos control sobre el contenido o las prácticas de privacidad de
                                sitios de terceros.
                            </p>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Cookies Policy */}
            <Card glass>
                <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                        <Cookie className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Política de Cookies
                        </h2>
                        <div className="prose dark:prose-invert max-w-none">
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                Este sitio web utiliza cookies para mejorar la experiencia del usuario y analizar
                                el tráfico del sitio.
                            </p>

                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                Tipos de Cookies que Utilizamos
                            </h3>
                            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                                <li>
                                    <strong>Cookies Analíticas:</strong> Google Analytics para entender cómo los
                                    usuarios interactúan con el sitio
                                </li>
                                <li>
                                    <strong>Cookies de Afiliados:</strong> Para rastrear las referencias a Amazon y
                                    atribuir correctamente las comisiones
                                </li>
                            </ul>

                            <p className="text-gray-700 dark:text-gray-300">
                                Al continuar navegando en este sitio, aceptas el uso de cookies según se describe
                                en esta política.
                            </p>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Contact */}
            <Card glass>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Contacto</h2>
                <p className="text-gray-700 dark:text-gray-300">
                    Si tienes alguna pregunta sobre estas políticas, puedes contactarnos en:{' '}
                    <a
                        href="mailto:info@bagotech.com"
                        className="text-primary-600 dark:text-primary-400 hover:underline"
                    >
                        info@bagotech.com
                    </a>
                </p>
            </Card>
        </div>
    )
}
