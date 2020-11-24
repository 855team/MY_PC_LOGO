import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import {Div} from '../common';

const Polygon = styled('polygon', {
    shouldForwardProp: prop => ['className', 'children', 'points'].indexOf(prop) !== -1
})((({style}) => style));

const Toggle = ({style, onClick}) => {
    const {height, width} = style;
    const midHeight = height * 0.5;
    const points = `0,0 0,${height} ${width},${midHeight}`;

    return (
        <div style={style.base} onClick={onClick}>
            <Div style={style.wrapper}>
                <svg t="1606216636318" className="icon" viewBox="0 0 1024 1024" version="1.1"
                     xmlns="http://www.w3.org/2000/svg" p-id="2933" width="16" height="16">
                    <path
                        d="M519.197891 980.112858c-76.077712 0-149.956068-21.893586-213.53744-63.281461-51.284975-33.490188-94.672264-79.176804-125.363272-132.261252-24.192912-41.687787-40.288197-87.07449-47.786001-134.660548-3.199063-20.094113-4.798594-40.78805-4.798594-61.282046 0-16.595138 13.496046-30.091184 30.091184-30.091185s30.091184 13.496046 30.091185 30.091185c0 17.394904 1.39959 34.889778 3.998828 51.98477 6.298155 40.288197 19.894172 78.576979 40.388168 113.86664 25.992385 44.98682 62.781607 83.675486 106.168895 111.967197 53.784243 34.989749 116.265938 53.484331 180.647077 53.484331 69.679586 0 136.360051-21.293762 192.843502-61.681929 13.496046-9.697159 32.29054-6.598067 41.987699 6.99795 9.697159 13.496046 6.598067 32.29054-6.997949 41.987699-66.580494 47.686029-145.357415 72.878649-227.733282 72.878649zM876.193303 675.402128c-1.599531 0-3.099092-0.099971-4.698624-0.399883-16.395197-2.599239-27.691887-17.994728-25.092648-34.389924 2.699209-17.094992 3.998828-34.589866 3.998828-51.98477 0-38.988578-6.698038-77.177389-19.894172-113.466758-17.994728-49.485502-48.285854-94.672264-87.474372-130.56175-35.189691-32.490481-77.877184-57.283218-123.5638-71.778971-64.781021-20.493996-135.960168-20.493996-200.84116 0-31.990628 10.197013-62.481695 25.29259-90.373523 44.786879-8.697452 6.298155-15.995314 11.996485-22.49341 17.494875-40.188226 33.890071-72.178854 77.27736-92.572879 125.663184-5.198477 12.496339-9.697159 25.592502-13.396076 38.688666-4.498682 15.995314-21.09382 25.392561-37.089134 20.993849-15.995314-4.498682-25.392561-21.09382-20.993849-37.089134 4.298741-15.49546 9.597188-30.89095 15.795372-45.886557 24.092942-57.283218 61.881871-108.568193 109.267988-148.456506 7.597774-6.398126 15.995314-12.896222 26.292297-20.493996 33.390218-23.393147 69.279703-41.187933 107.168603-53.184419 76.677536-24.292883 160.652934-24.292883 237.230499 0 53.984184 17.194962 104.569364 46.486381 146.157181 84.875134 46.186469 42.387582 81.876013 95.671971 103.269745 154.254808 15.595431 42.887435 23.493117 87.974226 23.493117 134.060725 0 20.493996-1.599531 41.187933-4.798594 61.282046-1.999414 14.995607-14.795665 25.592502-29.391389 25.592502z"
                        fill="#383F51" p-id="2934"></path>
                    <path
                        d="M628.765791 483.25842H431.623548c-4.998536 0-9.597188-2.399297-12.396368-6.498096L298.762472 301.511667c-4.698623-6.897979-2.999121-16.195255 3.898858-20.893879 6.897979-4.698623 16.195255-2.999121 20.893878 3.898858l115.966026 168.65059h181.346871l104.969247-149.356243c4.798594-6.798008 14.195841-8.39754 20.99385-3.698916 6.798008 4.798594 8.39754 14.195841 3.698916 20.993849L641.062189 476.860295c-2.79918 3.998828-7.397833 6.398126-12.296398 6.398125z"
                        fill="#383F51" p-id="2935"></path>
                    <path
                        d="M365.94279 636.613492H190.694133c-8.297569 0-15.095577-6.698038-15.095578-15.095577 0-8.297569 6.698038-15.095577 15.095578-15.095578h164.551791L406.530899 463.164307c2.79918-7.797716 11.396661-11.896515 19.194377-9.097334 7.797716 2.79918 11.896515 11.396661 9.097335 19.294347L380.038661 626.616421c-2.099385 5.998243-7.797716 9.997071-14.095871 9.997071z"
                        fill="#383F51" p-id="2936"></path>
                    <path
                        d="M344.049204 899.436493c-2.299326 0-4.598653-0.499854-6.698037-1.599531-7.397833-3.698916-10.496925-12.796251-6.698038-20.194084L403.931661 731.085815l-51.384946-102.769892c-3.698916-7.397833-0.699795-16.495167 6.698038-20.194084 7.397833-3.698916 16.495167-0.699795 20.194083 6.698038l54.78395 109.467929c2.099385 4.19877 2.099385 9.197305 0 13.496046L357.44528 891.038953c-2.599239 5.298448-7.897686 8.39754-13.396076 8.39754z"
                        fill="#383F51" p-id="2937"></path>
                    <path
                        d="M760.127306 866.546129c-3.898858 0-7.697745-1.499561-10.596895-4.398711L633.464415 746.081421H420.62677c-8.297569 0-15.095577-6.698038-15.095578-15.095577s6.698038-15.095577 15.095578-15.095577h219.035829c3.998828 0 7.797716 1.599531 10.596895 4.398711l120.464708 120.464707c5.898272 5.898272 5.898272 15.39549 0 21.293762-2.899151 2.999121-6.698038 4.498682-10.596896 4.498682z"
                        fill="#383F51" p-id="2938"></path>
                    <path
                        d="M639.662599 746.081421c-1.899444 0-3.898858-0.399883-5.798301-1.199648-7.697745-3.199063-11.29669-11.996485-8.097628-19.69423L677.851411 600.124182l-62.581666-125.263301c-3.698916-7.397833-0.699795-16.495167 6.698038-20.194084 7.397833-3.698916 16.495167-0.699795 20.194084 6.698038L707.942595 592.926291c1.999414 3.898858 2.099385 8.49751 0.399883 12.496339l-54.78395 131.361515c-2.399297 5.798301-7.997657 9.297276-13.895929 9.297276z"
                        fill="#383F51" p-id="2939"></path>
                    <path
                        d="M858.698428 614.719906H694.446549c-8.297569 0-15.095577-6.698038-15.095578-15.095577s6.698038-15.095577 15.095578-15.095578h164.251879c8.297569 0 15.095577 6.698038 15.095578 15.095578s-6.798008 15.095577-15.095578 15.095577zM628.765791 274.319633c-2.999121 0-6.098213-0.499854-9.097334-1.39959-64.781021-20.493996-136.060139-20.493996-200.84116 0-9.097335 2.899151-19.094406 1.299619-26.892122-4.398711-7.697745-5.698331-12.296398-14.695695-12.296397-24.292883V139.659084c0-76.977448 62.681636-139.659084 139.659084-139.659084 37.289075 0 72.278825 14.595724 98.671092 41.087963 26.392268 26.192326 40.987992 61.282046 40.987992 98.571121v104.469394c0 9.597188-4.598653 18.594552-12.296397 24.292883-5.398418 3.898858-11.596603 5.898272-17.894758 5.898272z m-109.5679-77.17739c26.792151 0 53.38436 2.699209 79.376745 8.097628v-65.580787c0-21.09382-8.297569-40.987992-23.293175-55.983598C560.185883 68.579908 540.391682 60.282339 519.197891 60.282339c-43.787172 0-79.376745 35.589573-79.376745 79.376745V205.239871c26.092356-5.398418 52.584594-8.097628 79.376745-8.097628zM858.89837 495.054964c-7.697745 0-15.39549-2.899151-21.293762-8.797422a30.048197 30.048197 0 0 1 0-42.587523l75.87777-75.877771c10.097042-10.097042 15.695402-23.693059 15.695402-38.188812 0-14.295812-5.698331-28.191741-15.695402-38.188811-10.197013-10.097042-23.693059-15.695402-38.188812-15.695402-14.495753 0-27.991799 5.59836-38.188812 15.695402l-52.384652 52.384653a30.048197 30.048197 0 0 1-42.587524 0 30.048197 30.048197 0 0 1 0-42.587524l52.384653-52.384653c21.493703-21.493703 50.185297-33.390218 80.776335-33.390217 30.591038 0 59.182661 11.896515 80.776335 33.390217 21.193791 21.193791 33.390218 50.58518 33.390218 80.776335 0 30.591038-11.796544 59.282632-33.390218 80.776336l-75.87777 75.87777c-5.898272 5.898272-13.596017 8.797423-21.293761 8.797422zM185.695597 479.259592c-7.697745 0-15.39549-2.899151-21.293762-8.797423l-60.082397-60.082397c-21.493703-21.493703-33.390218-50.185297-33.390218-80.776336 0-30.091184 12.196427-59.582544 33.390218-80.776335 21.493703-21.493703 50.185297-33.390218 80.776335-33.390217 30.591038 0 59.282632 11.896515 80.776335 33.390217l42.087669 42.08767c11.796544 11.796544 11.796544 30.790979 0 42.587523a30.048197 30.048197 0 0 1-42.587523 0l-42.087669-42.087669c-10.197013-10.097042-23.693059-15.695402-38.188812-15.695402s-27.991799 5.59836-38.188812 15.695402c-9.997071 9.997071-15.695402 23.893-15.695402 38.188811 0 14.495753 5.59836 27.991799 15.695402 38.188812l60.082398 60.082398c11.796544 11.796544 11.796544 30.790979 0 42.587523-5.898272 5.898272-13.596017 8.797423-21.293762 8.797423zM875.293566 1024c-29.291419 0-58.482866-11.096749-80.776335-33.390218l-83.275603-83.175632c-1.499561-1.499561-3.798887-3.798887-6.098213-6.99795-4.698623-6.498096-6.698038-14.595724-5.398418-22.49341 1.299619-7.897686 5.59836-14.995607 12.196426-19.69423 41.787757-30.091184 76.577565-69.879527 100.470566-115.266231 3.898858-7.497803 10.896808-12.996193 19.094406-15.095577 8.197598-2.099385 16.89505-0.699795 23.99297 3.898858 6.498096 4.19877 12.496339 9.097335 17.694816 14.395782l82.975691 82.975691c21.493703 21.693644 33.390218 50.385239 33.390218 80.776335s-11.796544 59.082691-33.290247 80.676364c-22.393439 22.293469-51.684858 33.390218-80.976277 33.390218zM774.62306 885.440594l62.581665 62.581665c21.09382 20.993849 55.283804 20.993849 76.377624 0 10.097042-10.197013 15.695402-23.793029 15.695402-38.188812s-5.59836-27.991799-15.795373-38.288782l-67.380259-67.38026c-19.994142 30.191155-44.087084 57.683101-71.479059 81.276189zM184.995802 1024c-30.591038 0-59.182661-11.896515-80.776335-33.390218-21.493703-21.693644-33.390218-50.285268-33.390218-80.776335 0-30.391096 11.796544-59.082691 33.290247-80.676364l80.876306-80.876306c11.796544-11.796544 30.790979-11.796544 42.587523 0s11.796544 30.790979 0 42.587523l-80.776335 80.776335c-10.097042 10.197013-15.695402 23.793029-15.695402 38.188812s5.59836 27.991799 15.795373 38.188812c10.097042 10.097042 23.593088 15.695402 38.088841 15.695402s27.991799-5.59836 38.188812-15.695402l77.677243-77.677243c11.796544-11.796544 30.790979-11.796544 42.587523 0s11.796544 30.790979 0 42.587523l-77.677243 77.677243c-21.493703 21.493703-50.185297 33.390218-80.776335 33.390218z"
                        fill="#383F51" p-id="2940"></path>
                    <path
                        d="M453.517134 139.659084m-21.893586 0a21.893586 21.893586 0 1 0 43.787172 0 21.893586 21.893586 0 1 0-43.787172 0Z"
                        fill="#383F51" p-id="2941"></path>
                    <path
                        d="M584.878649 139.659084m-21.893586 0a21.893586 21.893586 0 1 0 43.787172 0 21.893586 21.893586 0 1 0-43.787172 0Z"
                        fill="#383F51" p-id="2942"></path>
                </svg>
            </Div>
        </div>
    );
};

Toggle.propTypes = {
    onClick: PropTypes.func.isRequired,
    style: PropTypes.object
};

export default Toggle;