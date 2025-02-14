'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

const PrivacyPolicy = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }
    return (
        <div className='px-4 py-8 mx-auto max-w-4xl'>
            <div className='flex justify-center mb-8'>
                <Image
                    src='/logo.png'
                    height={400}
                    width={500}
                    alt='Company Logo'
                    className='w-auto h-24'
                />
            </div>

            <h1 className='mb-6 text-3xl font-bold text-center'>
                Privacy Policy
            </h1>

            <div className='space-y-4 text-gray-700'>
                <p>
                    This privacy policy is an electronic record in the form of
                    an electronic contract formed under the information
                    technology act, 2000 & 2021 and the rules made thereunder
                    and the amended provisions pertaining to electronic
                    documents / records in various statutes as amended by the
                    information technology act, 2000 & 2021. This privacy policy
                    does not require any physical, electronic or digital
                    signature. This document is published and shall be construed
                    in accordance with the provisions of the information
                    technology (reasonable security practices and procedures and
                    sensitive personal data of information) rules, 2011 under
                    information technology act, 2000; that require publishing of
                    the privacy policy for collection, use, storage and transfer
                    of sensitive personal data or information. <br /> <br />{' '}
                    This privacy policy (“Policy”) explains our Company policy
                    regarding the collection, use, disclosure and transfer of
                    your data by Dart Inbox Solutions Private Limited, a private
                    limited company incorporated under Indian Company Act 2013,
                    CIN U72501KA2022PTC157219 with its registered office at No.
                    46/1, Bhattarahalli Village, Virgo Nagar, P.O., Bangalore,
                    Karnataka, India, 560036 or any of its affiliate(s) (“we” or
                    “us” or “our”) using the website https://dartinbox.com/
                    Site, and /or the App “Dart Inbox” available on digital
                    platforms. <br /> <br /> This privacy policy is a legal
                    document binding between you and Dart Inbox Solutions
                    Private Limited (hereinafter called “Dart Inbox”) (both
                    terms defined below). <br /> <br />
                    the terms of this privacy policy will be effective upon your
                    acceptance of the same (directly or indirectly in electronic
                    form, by use or the website or by other means) and will
                    govern the relationship between you and Dart Inbox for your
                    use of the website (defined below). Dart Inbox Solutions
                    Private Limited, hereinafter referred to as “Dart Inbox” is
                    the licensed owner of the Dart Inbox App and the website
                    www.dartinbox.com (”The Site”). Dart Inbox respects your
                    privacy and this Privacy Policy provides information on the
                    manner in which your data is collected and used by the Dart
                    Inbox on the Site. As a visitor to the Site/ Customer you
                    are advised to please read the Privacy Policy carefully. By
                    accessing the services provided by the Site you agree to the
                    collection and use of your data by the Dart Inbox in the
                    manner provided in this Privacy Policy. <br /> <br />
                    Please read this privacy policy carefully. by using the
                    website, you indicate that you understand, agree and consent
                    to this privacy policy. if you do not agree with the terms
                    of this privacy policy, please do not use this website. you
                    hereby provide your unconditional consent or agreements to
                    the Dart Inbox as provided under section 43a and section 72a
                    of information technology act, 2000. The User may revoke its
                    consent for providing the sensitive information (as defined
                    under Information Technology (Reasonable security practices
                    and procedures and sensitive personal data or information)
                    Rules, 2011) by reaching out to Dart Inbox support in
                    writing and Dart Inbox may discontinue to provide services,
                    which are depended or requires such sensitive information.
                </p>

                <h2 className='mt-6 text-xl font-semibold'>
                    Information Collection
                </h2>
                <p>
                    As part of the registration process or to avail services of
                    the Dart Inbox on the Site or the Dart Inbox App, Dart Inbox
                    may collect the following personally identifiable
                    information about you: name, email address, phone number,
                    business entity information, account number of the Users,
                    KYC details and any other such information as required,
                    demographic profile (like your age, gender, occupation,
                    education, address etc.) and information about the pages on
                    the site you visit/access, the links you click on the site,
                    the number of times you access the page and any such
                    browsing information. We do not knowingly contact or collect
                    personal information from children under 13. If you believe
                    we have inadvertently collected such information, please
                    contact us so we can promptly obtain parental consent or
                    remove the information.
                </p>

                <h2 className='mt-6 text-xl font-semibold'>
                    Method of collecting the Information
                </h2>
                <p>
                    {' '}
                    Dart Inbox will collect personally identifiable information
                    about you only as part of a voluntary registration process,
                    on-line survey or any combination thereof. The Site may
                    contain links to other Web sites. Dart Inbox is not
                    responsible for the privacy practices of such Web sites,
                    which it does not own, manage or control. The Site and
                    third-party vendors, including Google, use first-party
                    cookies (such as the Google Analytics cookie) and
                    third-party cookies (such as the DoubleClick cookie)
                    together to inform, optimize, and serve ads based on
                    someone’s past visits to the Site.
                </p>

                <h2 className='mt-6 text-xl font-semibold'>
                    Share your location only with permission
                </h2>
                <p>
                    In serving you, Dart Inbox name may use or store your
                    precise geographic location, if you give us permission to do
                    so. We do not use or share this data for any other purpose.
                    Many devices will indicate through an icon when location
                    services are operating. We only share this location
                    information with others as approved by you.
                </p>
                <h2 className='mt-6 text-xl font-semibold'>
                    Use of the information
                </h2>
                <p>
                    Dart Inbox will use your personal information to provide
                    personalized features to you on the Site and to provide for
                    promotional offers to you through the Site and other
                    channels. Dart Inbox will also provide this information to
                    its business associates and partners to get in touch with
                    you when necessary to provide the services requested by you.
                    Dart Inbox will use this information to preserve transaction
                    history as governed by existing law or policy. Dart Inbox
                    may also use contact information internally to direct its
                    efforts for product improvement, to contact you as a survey
                    respondent, to notify you if you win any contest; and to
                    send you promotional materials from its contest sponsors or
                    advertisers. Dart Inbox will also use this information to
                    serve various promotional and advertising materials to you
                    via display advertisements through the Google Ad network on
                    third party websites. You can opt out of Google Analytics
                    for Display Advertising and customize Google Display network
                    ads using the Ads Preferences Manager. Information about
                    Customers on an aggregate (excluding any information that
                    may identify you specifically) covering Customer transaction
                    data and Customer demographic and location data may be
                    provided to partners of the Dart Inbox for the purpose of
                    creating additional features on the website, creating
                    appropriate merchandising or creating new products and
                    services and conducting marketing research and statistical
                    analysis of customer behavior and transactions.
                </p>

                <h2 className='mt-6 text-xl font-semibold'>
                    Information automatically tracked while using the App or
                    Site
                </h2>
                <p>
                    We follow a policy to store all your credit card / other
                    payment records in a cloud-based environment using the
                    services of third-party infrastructure service providers.
                    (Please add some other details here like how we store
                    contact information of customers, how we keep log of
                    customer receivables / payables, Information about customer
                    {"device's"} connection to the internet, including address,
                    cookies for tracking or assigning unique number to any
                    visitor)
                </p>

                <h2 className='mt-6 text-xl font-semibold'>
                    Sharing of your information
                </h2>
                <p>
                    Dart Inbox will not use your financial information for any
                    purpose other than to complete a transaction with you. Dart
                    Inbox does not rent, sell or share your personal information
                    and will not disclose any of your personally identifiable
                    information to third parties. In cases where it has your
                    permission to provide products or services you’ve requested
                    and such information is necessary to provide these products
                    or services the information may be shared with Dart Inbox
                    business associates and partners. Nevertheless, Dart Inbox
                    may use this information any special offers or promotional
                    activities related to Dart Inbox or its services In order to
                    serve you better, Dart Inbox may share your personal and
                    anonymous information with other companies, including
                    vendors and contractors. Their use of information is limited
                    to these purposes, and subject to agreements that require
                    them to keep the information confidential. Our vendors
                    provide assurance that they take reasonable steps to
                    safeguard the data they hold on our behalf, although data
                    security cannot be guaranteed. Dart Inbox, generally do not
                    share personally identifiable information (such as name,
                    address, email or phone) with other companies or allow
                    advertising companies to collect data through our service
                    for ad targeting.
                </p>

                <h2 className='mt-6 text-xl font-semibold'>
                    Disclosure of your information
                </h2>
                <p>
                    To operate our services, we also may make identifiable and
                    anonymous information available to third parties in these
                    limited circumstances:
                    <ul className='pl-6 mt-2 list-disc'>
                        <li>with your express consent,</li>
                        <li>
                            when we have a good faith belief it is required by
                            law,
                        </li>
                        <li>
                            when we have a good faith belief it is necessary to
                            protect our rights or property, or
                        </li>
                        <li>
                            to any successor or purchaser in a merger,
                            acquisition, liquidation, dissolution or sale of
                            assets.
                        </li>
                    </ul>
                    Your consent will not be required for disclosure in these
                    cases, but we will attempt to notify you, to the extent
                    permitted by law to do so.
                </p>
                <p className='mt-4'>
                    In addition, under any special circumstances, Dart Inbox
                    could share information to help investigate, prevent or take
                    action regarding unlawful and illegal activities, suspected
                    fraud, potential threat to the safety or security of any
                    person, violations of the its terms of use or to defend
                    against legal claims; special circumstances such as
                    compliance with subpoenas, court orders, requests/order from
                    legal authorities or law enforcement agencies requiring such
                    disclosure.
                </p>

                <h2 className='mt-6 text-xl font-semibold'>
                    Protecting your personal information
                </h2>

                <p>
                    To protect against the loss, misuse and modification or
                    alteration of the information under its control, Dart Inbox
                    will take reasonable steps to secure your personally
                    identifiable information against unauthorized access or
                    disclosure. We encrypt transmission of data on pages where
                    you provide payment information. However, no security or
                    encryption method can be guaranteed to protect information
                    from hackers or human error. Although, Dart Inbox will
                    endeavor, to safeguard the confidentiality of your
                    personally identifiable information, transmissions made by
                    means of the Internet cannot be made absolutely secure. By
                    using this site, you agree that Dart Inbox will have no
                    liability for disclosure of your information due to errors
                    in transmission or unauthorized acts of third parties.
                    Information collected may be stored or processed on
                    computers located in any country where we do business.
                </p>

                <h2 className='mt-6 font-semibold'>
                    Policy updates/Questions/Grievance Redressal
                </h2>

                <p>
                    Dart Inbox reserves the right to change or update this
                    policy at any time. If we make any material changes to our
                    policies, we will place a prominent notice on our website or
                    application. Any changes we make will be effective
                    immediately on notice, which we may give by posting the new
                    policy on the Site. Your use of the Dart Inbox app Services
                    after such notice will be deemed acceptance of such changes.
                    We may also make reasonable efforts to inform you via
                    electronic mail. In any case, you are advised to review this
                    Policy periodically on the Site to ensure that you are aware
                    of the latest version. In the event you have any grievance
                    relating to the processing of Information provided by you,
                    you may contact our Grievance Officer or write to us at the
                    following address:
                </p>

                <div className='gap-1 col-flex'>
                    <h2 className='mt-6 mb-2 text-xl font-semibold'>
                        Contact Information
                    </h2>
                    <p className='text-lg font-semibold'>Dart Inbox </p>
                    <p>
                        Product under{' '}
                        <Link
                            href={'https://bizryt.com/'}
                            target='_blank'
                            className='font-semibold text-info'
                        >
                            {' '}
                            Bizryt solution private limited
                        </Link>
                    </p>
                    <h6 className='text-xl font-semibold'>Address:</h6>
                    <p>
                        No. 46/1, Bhattarahalli Village, Virgo Nagar, <br />{' '}
                        P.O., Bangalore, Karnataka, India, 560036 <br /> Tel.:
                        +91 70456 94314 <br /> Email id: hemantanshu@gmail.com
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
